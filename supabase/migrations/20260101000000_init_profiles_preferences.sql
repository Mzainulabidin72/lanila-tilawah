-- Lanila Tilawah — Part 01: profiles, user_preferences, trigger, RLS
-- Jalankan lewat `supabase db push` atau tempel di SQL Editor.

-- ---------------------------------------------------------------
-- 1. Fungsi updated_at
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------
-- 2. Tabel
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '' check (char_length(full_name) <= 120),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.user_preferences (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  language    text not null default 'id' check (char_length(language) between 2 and 10),
  theme       text not null default 'light' check (theme in ('light', 'dark', 'system')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint user_preferences_user_id_key unique (user_id)
);
-- Constraint unique di atas otomatis membuat index pada user_id.

-- ---------------------------------------------------------------
-- 3. Trigger updated_at
-- ---------------------------------------------------------------
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_user_preferences_updated_at on public.user_preferences;
create trigger trg_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------
-- 4. Inisialisasi profil saat user mendaftar (server-side, aman)
-- ---------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(
      coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        split_part(coalesce(new.email, ''), '@', 1)
      ),
      120
    )
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Fungsi ini hanya boleh dipanggil oleh trigger, bukan lewat API.
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill untuk user yang sudah ada sebelum migrasi ini.
insert into public.profiles (id, full_name)
select u.id, left(coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(u.email, ''), '@', 1)), 120)
from auth.users u
on conflict (id) do nothing;

insert into public.user_preferences (user_id)
select u.id from auth.users u
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.user_preferences enable row level security;
alter table public.profiles         force row level security;
alter table public.user_preferences force row level security;

-- Privilege tingkat tabel (lapisan kedua di bawah RLS)
revoke all on public.profiles         from anon, authenticated;
revoke all on public.user_preferences from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

grant select on public.user_preferences to authenticated;
grant insert (user_id, language, theme) on public.user_preferences to authenticated;
grant update (language, theme) on public.user_preferences to authenticated;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- user_preferences
drop policy if exists "prefs_select_own" on public.user_preferences;
create policy "prefs_select_own" on public.user_preferences
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "prefs_insert_own" on public.user_preferences;
create policy "prefs_insert_own" on public.user_preferences
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "prefs_update_own" on public.user_preferences;
create policy "prefs_update_own" on public.user_preferences
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
