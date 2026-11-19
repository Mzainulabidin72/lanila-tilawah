# Lanila Tilawah — Part 01 (Fondasi & Auth) + Part 02 (Design System & Layout)

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


---

# Part 02 — Design System & Layout Aplikasi

> ⚠️ **Status verifikasi:** sama seperti Part 01, kode Part 02 ditulis tanpa `node_modules`/browser,
> jadi **belum dijalankan**. Yang sudah dicek secara statis: semua import ter-resolve dan tidak ada import
> yang tidak terpakai; data surah diverifikasi (114 surah, total 6.236 ayat, 86 Makkiyah / 28 Madaniyah).
> `tsc`, build, tampilan responsif, dan dark mode **belum diuji**; jalankan checklist di bawah.

## Cara memasang ke repo yang sudah ada

Ekstrak zip, lalu **timpa/salin** isi `src/`, `index.html`, `tailwind.config.js`, `README.md` ke repo kamu.
Jangan menimpa `.env` dan `package-lock.json`. Tidak ada dependency baru, jadi `npm install` tidak wajib.
Hapus file lama yang sudah digantikan (jika masih ada):

- `src/pages/dashboard/` (diganti `pages/home`, `quran`, `audio`, `learning`, `memorization`, `progress`, `settings`)
- `src/components/layout/{Header,MobileNav,MobileDrawer,UserMenu,NavLinks}.tsx`

## Design system

- **Token warna**: CSS variable di `src/styles/index.css` (`:root` dan `.dark`), dipetakan di `tailwind.config.js`.
  Komponen memakai nama semantik (`bg-surface`, `text-ink`, `border-line`, `text-brand`, `bg-primary-soft`), jadi
  otomatis mengikuti tema. Jangan memakai hex langsung di komponen.
- **Tipografi**: `src/styles/typography.css` (`type-page-title`, `type-section-title`, `type-card-title`, `type-body`,
  `type-label`, `type-caption`, `type-nav`). Teks Arab memakai kelas `quran-text` / `font-quran`, terpisah dari font UI.
  Font Al-Qur'an dipasang di Part 03.
- **Komponen** (`src/components/ui`): Button (+`buttonStyles` untuk Link), IconButton, Card, SectionHeader, PageHeader,
  SearchInput, ProgressBar, ProgressRing, EmptyState, LoadingState, Modal (bottom sheet di mobile), Dropdown,
  ThemeToggle, Avatar, Badge, Alert, TextField.
- **Navigasi**: Sidebar (rail ikon di tablet, penuh di ≥1024px), BottomNavigation 5 item di mobile
  (Beranda, Al-Qur'an, Audio, Belajar, Progres). Hafalan dan Profil diakses lewat menu profil (bottom sheet),
  halaman Belajar, dan Beranda.
- **Dark mode**: default terang. Pilihan disimpan di `localStorage` (`lanila-tilawah-theme`), diterapkan sebelum
  render pertama (tanpa kedip), dan disinkronkan ke `user_preferences.theme` bila bisa.
- **Fitur yang dijadwalkan nanti** membuka dialog "Segera hadir" yang sama (`useComingSoon`), tidak ada tombol mati.

## Yang benar-benar berfungsi di Part 02

Navigasi dan highlight rute aktif, ganti tema, menu profil, logout (memakai auth Part 01), edit nama profil
(update `profiles.full_name` lewat RLS), ganti kata sandi (`supabase.auth.updateUser`), pencarian dan filter surah,
"Tampilkan lebih banyak" di Audio.

## Data sementara (jelas ditandai di UI)

`src/data/surahs.ts`: nama, jumlah ayat, tempat turun. **Belum divalidasi**, tanpa teks Arab. Diganti dataset
tervalidasi di Part 03. Tidak ada ayat, statistik, atau target buatan di mana pun.

## Checklist verifikasi Part 02 (belum dijalankan)

- [ ] `npm run build` (termasuk `tsc --noEmit`) tanpa error
- [ ] Halaman: Beranda, Al-Qur'an, Audio, Belajar, Hafalan, Progres, Profil & Pengaturan
- [ ] Lebar 360, 390, 430, 768, 1024, 1280, 1440: tanpa scroll horizontal, konten tidak tertutup bottom nav
- [ ] Light/dark: sidebar, kartu, dialog, input, nav, toast; refresh halaman mempertahankan tema
- [ ] Edit profil mengubah nama di sidebar/menu; ganti kata sandi sukses; logout dari sidebar, menu profil, dan Pengaturan
- [ ] Dialog: Esc menutup, Tab tidak keluar dari dialog, fokus kembali ke tombol pemicu
- [ ] Console browser bersih

## Keterbatasan yang diketahui

- Logo masih placeholder (ganti dengan aset resmi Lanila, lihat Part 01).
- Tema belum dimuat dari database saat login di perangkat baru (hanya ditulis ke database).
- Bahasa selain Indonesia, notifikasi, preferensi membaca, foto profil: ditandai "Segera".
- Ganti kata sandi bisa meminta login ulang jika Supabase mengaktifkan "secure password change".
- Tidak ada test otomatis.

**Fase berikutnya: Part 03 (Al-Qur'an).** Jangan dimulai sebelum Part 02 direview.
