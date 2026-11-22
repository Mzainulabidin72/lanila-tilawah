-- Lanila Tilawah — Part 03: data master Al-Qur'an + data pengguna (penanda, posisi baca)
-- Data master TIDAK dimasukkan oleh migrasi ini. Diimpor lewat scripts/quran/import-quran.mjs
-- setelah lolos validasi (lihat docs/QURAN_DATA.md).

-- =====================================================================
-- 1. DATA MASTER (publik, hanya-baca untuk klien)
-- =====================================================================
create table if not exists public.quran_surahs (
  id                 smallint primary key check (id between 1 and 114),
  name_arabic        text not null check (char_length(name_arabic) > 0),
  name_latin         text not null check (char_length(name_latin) > 0),
  meaning_english    text,
  meaning_indonesian text,                       -- null sampai ada sumber terverifikasi
  total_ayah         smallint not null check (total_ayah > 0),
  revelation_type    text not null check (revelation_type in ('Makkiyah', 'Madaniyah')),
  revelation_order   smallint
);

create table if not exists public.quran_ayahs (
  id           integer primary key check (id between 1 and 6236),   -- urutan global mushaf
  surah_id     smallint not null references public.quran_surahs (id),
  ayah_number  smallint not null check (ayah_number >= 1),
  arabic_text  text not null check (char_length(btrim(arabic_text)) > 0),
  juz_number   smallint not null check (juz_number between 1 and 30),
  page_number  smallint check (page_number between 1 and 604),      -- Mushaf Madinah, dari metadata Tanzil
  constraint quran_ayahs_surah_ayah_key unique (surah_id, ayah_number)
);
create index if not exists quran_ayahs_juz_idx on public.quran_ayahs (juz_number, id);

create table if not exists public.quran_juz (
  juz_number         smallint primary key check (juz_number between 1 and 30),
  start_surah_id     smallint not null,
  start_ayah_number  smallint not null,
  foreign key (start_surah_id, start_ayah_number)
    references public.quran_ayahs (surah_id, ayah_number)
);

create table if not exists public.quran_translations (
  id                bigint generated always as identity primary key,
  ayah_id           integer not null references public.quran_ayahs (id) on delete cascade,
  language_code     text not null,
  translator_name   text not null,
  translation_text  text not null check (char_length(btrim(translation_text)) > 0),
  source_reference  text not null,
  constraint quran_translations_unique unique (ayah_id, language_code, translator_name)
);

-- Satu baris yang mencatat asal data dan status validasi. Aplikasi hanya menampilkan
-- Al-Qur'an bila validated = true dan jumlah ayat sesuai.
create table if not exists public.quran_dataset_info (
  id                      smallint primary key default 1 check (id = 1),
  validated               boolean not null default false,
  validated_at            timestamptz,
  validation_summary      jsonb,
  numbering_convention    text,
  total_surah             smallint,
  total_ayah              integer,
  text_source             text,
  text_version            text,
  text_license            text,
  text_attribution        text,
  text_sha256             text,
  metadata_sha256         text,
  translation_language    text,
  translation_translator  text,
  translation_license     text,
  translation_attribution text,
  translation_sha256      text
);
insert into public.quran_dataset_info (id) values (1) on conflict (id) do nothing;

alter table public.quran_surahs       enable row level security;
alter table public.quran_ayahs        enable row level security;
alter table public.quran_juz          enable row level security;
alter table public.quran_translations enable row level security;
alter table public.quran_dataset_info enable row level security;

revoke all on public.quran_surahs, public.quran_ayahs, public.quran_juz,
              public.quran_translations, public.quran_dataset_info from anon, authenticated;
grant select on public.quran_surahs, public.quran_ayahs, public.quran_juz,
                public.quran_translations, public.quran_dataset_info to anon, authenticated;

-- Dapat dibaca publik (membaca tidak butuh login). Tulis hanya lewat service_role (bypass RLS), di luar frontend.
do $$
declare t text;
begin
  foreach t in array array['quran_surahs','quran_ayahs','quran_juz','quran_translations','quran_dataset_info'] loop
    execute format('drop policy if exists "%1$s_public_read" on public.%1$s', t);
    execute format('create policy "%1$s_public_read" on public.%1$s for select to anon, authenticated using (true)', t);
  end loop;
end $$;

-- =====================================================================
-- 2. DATA PENGGUNA
-- =====================================================================
create table if not exists public.bookmarks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  surah_id     smallint not null,
  ayah_number  smallint not null,
  note         text check (note is null or char_length(note) <= 500),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint bookmarks_user_verse_key unique (user_id, surah_id, ayah_number),
  foreign key (surah_id, ayah_number) references public.quran_ayahs (surah_id, ayah_number)
);
create index if not exists bookmarks_user_created_idx on public.bookmarks (user_id, created_at desc);

drop trigger if exists trg_bookmarks_updated_at on public.bookmarks;
create trigger trg_bookmarks_updated_at before update on public.bookmarks
  for each row execute function public.set_updated_at();

-- updated_at = waktu BACA yang dikirim klien (bukan now()), dipakai aturan "yang lebih baru menang".
create table if not exists public.reading_positions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references auth.users (id) on delete cascade,
  surah_id     smallint not null,
  ayah_number  smallint not null,
  updated_at   timestamptz not null default now(),
  foreign key (surah_id, ayah_number) references public.quran_ayahs (surah_id, ayah_number)
);

alter table public.bookmarks         enable row level security;
alter table public.reading_positions enable row level security;
alter table public.bookmarks         force row level security;
alter table public.reading_positions force row level security;

revoke all on public.bookmarks, public.reading_positions from anon, authenticated;
grant select, delete on public.bookmarks to authenticated;
grant insert (user_id, surah_id, ayah_number, note) on public.bookmarks to authenticated;
grant update (note) on public.bookmarks to authenticated;

grant select on public.reading_positions to authenticated;
grant insert (user_id, surah_id, ayah_number, updated_at) on public.reading_positions to authenticated;
grant update (surah_id, ayah_number, updated_at) on public.reading_positions to authenticated;

-- bookmarks
drop policy if exists "bookmarks_select_own" on public.bookmarks;
create policy "bookmarks_select_own" on public.bookmarks for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "bookmarks_insert_own" on public.bookmarks;
create policy "bookmarks_insert_own" on public.bookmarks for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists "bookmarks_update_own" on public.bookmarks;
create policy "bookmarks_update_own" on public.bookmarks for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "bookmarks_delete_own" on public.bookmarks;
create policy "bookmarks_delete_own" on public.bookmarks for delete to authenticated
  using (user_id = (select auth.uid()));

-- reading_positions (baca + ubah milik sendiri; tidak ada delete)
drop policy if exists "positions_select_own" on public.reading_positions;
create policy "positions_select_own" on public.reading_positions for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "positions_insert_own" on public.reading_positions;
create policy "positions_insert_own" on public.reading_positions for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists "positions_update_own" on public.reading_positions;
create policy "positions_update_own" on public.reading_positions for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Simpan posisi baca: server menolak data yang lebih lama dari yang sudah tersimpan,
-- sehingga data lokal yang basi tidak menimpa posisi yang lebih baru dari perangkat lain.
create or replace function public.save_reading_position(
  p_surah_id smallint, p_ayah_number smallint, p_read_at timestamptz
) returns public.reading_positions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  r public.reading_positions;
begin
  insert into public.reading_positions as rp (user_id, surah_id, ayah_number, updated_at)
  values ((select auth.uid()), p_surah_id, p_ayah_number, least(p_read_at, now()))
  on conflict (user_id) do update
    set surah_id = excluded.surah_id,
        ayah_number = excluded.ayah_number,
        updated_at = excluded.updated_at
    where rp.updated_at < excluded.updated_at
  returning rp.* into r;

  if r.id is null then
    select * into r from public.reading_positions where user_id = (select auth.uid());
  end if;
  return r;
end;
$$;
revoke all on function public.save_reading_position(smallint, smallint, timestamptz) from public, anon;
grant execute on function public.save_reading_position(smallint, smallint, timestamptz) to authenticated;
