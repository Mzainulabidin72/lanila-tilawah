# Lanila Tilawah — Part 01: Fondasi & Autentikasi

Teman Al-Qur'an pribadi (Read · Listen · Learn · Grow). Aplikasi mandiri dengan autentikasi sendiri
(tanpa SSO / app switching dengan aplikasi Lanila lain).

**Stack:** React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · Supabase (Auth + PostgreSQL) · React Router 6 · Lucide · Vercel

> ⚠️ **Status verifikasi:** kode ini ditulis tanpa akses jaringan, jadi `npm install`, `npm run build`,
> koneksi Supabase, dan pengujian RLS **belum dijalankan**. Lihat bagian "Checklist verifikasi" di bawah
> dan jalankan sendiri sebelum menandai Part 01 selesai.

## 1. Setup lokal

```bash
npm install
cp .env.example .env      # isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
npm run dev
```

Jika variabel belum diisi, aplikasi menampilkan layar "Konfigurasi Supabase belum lengkap".
Aplikasi juga menolak key bertipe `service_role`.

## 2. Setup Supabase

1. Buat project di supabase.com. Salin **Project URL** dan **anon public key** ke `.env`.
2. Jalankan migrasi: `supabase/migrations/20260101000000_init_profiles_preferences.sql`
   (lewat `supabase db push` atau tempel di SQL Editor).
3. **Authentication → URL Configuration**
   - Site URL: URL produksi (mis. `https://tilawah.vercel.app`)
   - Redirect URLs: `http://localhost:5173/**` dan `https://<domain-produksi>/**`
     (dibutuhkan untuk konfirmasi email dan `/reset-password`).
4. **Authentication → Providers → Email**: pilih apakah "Confirm email" aktif.
   - Aktif: setelah daftar, pengguna melihat layar "Cek email kamu".
   - Nonaktif: pengguna langsung masuk setelah daftar.
5. (Disarankan) Atur Password policy minimal 8 karakter di Supabase agar selaras dengan validasi frontend.
6. (Produksi) Konfigurasikan SMTP kustom; SMTP bawaan Supabase memiliki batas kirim yang rendah.

## 3. Arsitektur singkat

| Area | Keputusan |
| --- | --- |
| Profil | Dibuat oleh trigger `on_auth_user_created` (`SECURITY DEFINER`, `search_path=''`), bukan oleh frontend. Nama diambil dari `raw_user_meta_data.full_name`. |
| Preferensi | Baris `user_preferences` dibuat oleh trigger yang sama; `user_id` unik. |
| RLS | Aktif + `FORCE` di kedua tabel. Policy memakai `(select auth.uid())`. `anon` tidak punya akses. UPDATE dibatasi per kolom (`id`/`user_id` tidak dapat diubah). |
| Sesi | `persistSession`, `autoRefreshToken`, `storageKey` khusus (`lanila-tilawah-auth`). `AuthProvider` memulihkan sesi saat startup; route diblokir sampai verifikasi selesai (tidak ada redirect loop). |
| Auth listener | Callback `onAuthStateChange` sinkron; profil dimuat di effect terpisah untuk menghindari deadlock supabase-js. |
| Reset password | `/reset-password` berada di luar `PublicOnlyRoute` karena tautan recovery membuat sesi sementara. Error pada hash URL (`otp_expired`) ditangani. Setelah sukses, pengguna dikeluarkan dan diminta masuk ulang. |
| Pesan error | Semua error Supabase dipetakan di `src/lib/utils/errors.ts`; teknis tidak pernah ditampilkan mentah. |

## 4. Struktur

```
src/
  components/{ui,layout,shared}   config/   contexts/   hooks/   layouts/
  lib/{supabase,utils}   pages/{auth,dashboard,errors}   routes/   services/   types/   styles/
supabase/  migrations/  tests/rls_check.sql  seed.sql
```

## 5. Deploy ke Vercel

Import repo, framework preset **Vite**, tambahkan dua env var di atas. `vercel.json` sudah berisi rewrite SPA.

## 6. Checklist verifikasi (belum dijalankan)

- [ ] `npm install && npm run build` sukses tanpa error TypeScript
- [ ] Daftar → profil & preferensi terbuat di tabel
- [ ] Masuk, keluar, refresh halaman (sesi bertahan), akses `/` setelah logout ditolak
- [ ] Lupa kata sandi → email → `/reset-password` → masuk dengan sandi baru
- [ ] Tautan reset kedaluwarsa menampilkan layar "Tautan tidak valid"
- [ ] `supabase/tests/rls_check.sql`: user A tidak bisa melihat/mengubah data user B; `anon` ditolak
- [ ] Tata letak di 360px, 430px, 768px, 1024px, 1280px tanpa overflow horizontal

## 7. Belum selesai / perlu tindakan manual

- **Logo resmi Lanila**: `src/components/shared/Logo.tsx` dan `public/favicon.svg` hanyalah placeholder. Ganti dengan aset master resmi.
- Konfigurasi dashboard Supabase (langkah 2–6 di atas).
- Fitur Al-Qur'an, audio, belajar, hafalan, progres: sengaja belum ada (halaman placeholder).
- Pengeditan profil/preferensi di UI belum ada (service dan RLS sudah siap).
- Tidak ada test otomatis pada fase ini.

**Fase berikutnya: Part 02 — UI/UX & Responsive Design.** Jangan dimulai sebelum Part 01 direview.
