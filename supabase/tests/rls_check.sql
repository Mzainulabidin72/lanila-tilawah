-- Verifikasi manual RLS. Jalankan di Supabase SQL Editor SETELAH ada minimal 2 user.
-- Ganti dua UUID di bawah dengan id dari auth.users.
-- Hasil yang diharapkan ada di komentar.

-- 0) RLS aktif?  (harus true untuk keduanya)
select relname, relrowsecurity, relforcerowsecurity
from pg_class where relname in ('profiles', 'user_preferences');

begin;
  set local role authenticated;
  select set_config('request.jwt.claims', '{"sub":"UUID_USER_A","role":"authenticated"}', true);

  select count(*) as lihat_profil_sendiri_dan_lain from public.profiles;           -- harus 1
  select count(*) as lihat_prefs_sendiri_dan_lain from public.user_preferences;    -- harus 1

  update public.profiles set full_name = 'Diretas' where id = 'UUID_USER_B';       -- harus 0 baris
rollback;

begin;
  set local role anon;
  select count(*) as anon_profiles from public.profiles;  -- harus ERROR permission denied
rollback;
