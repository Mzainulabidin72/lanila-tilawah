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

# Part 02 — UI/UX Foundation, Design System & Layout Responsif

> ⚠️ **Status verifikasi:** kode ditulis tanpa `node_modules`/browser, jadi `tsc`, build, tampilan responsif,
> dark mode, dan regresi auth Part 01 **belum diuji**. Sudah dicek statis: semua import ter-resolve dan tidak ada
> import yang tidak terpakai; data surah diverifikasi (114 surah, 6.236 ayat, 86 Makkiyah / 28 Madaniyah).

## Memasang ke repo yang sudah ada

Salin isi `src/`, `index.html`, `tailwind.config.js`, `public/favicon.svg`, `README.md` ke repo (jangan timpa `.env`
dan `package-lock.json`). Tidak ada dependency baru. Hapus sisa file lama bila ada:
`src/pages/dashboard/`, `src/components/layout/{Header,MobileNav,MobileDrawer,UserMenu,NavLinks}.tsx`,
`src/components/ui/Dropdown.tsx` (diganti `DropdownMenu.tsx`).

## Design tokens

- **Warna**: CSS variable di `src/styles/index.css` (`:root` / `.dark`) → `tailwind.config.js`. Pakai nama semantik
  (`bg-canvas`, `bg-surface`, `bg-elevated`, `text-ink`, `text-brand`, `border-line`, `bg-primary-soft`), jangan hex langsung.
  Palet: Emerald `#167C65`, Deep Emerald `#105B4B`, Soft Mint `#E8F4EF`, Gold `#C9A45C`, latar `#F8FAF8`; dark sesuai spesifikasi.
  Catatan kontras: `#77827C` (muted) hanya ~3,9:1 di atas putih, jadi dipakai untuk placeholder/dekoratif;
  teks sekunder berukuran kecil memakai `muted-strong` yang lebih gelap.
- **Tipografi**: `src/styles/typography.css` (`type-*`). Teks Arab: `quran-text` / `font-quran`, RTL, line-height 2.2
  (siap untuk harakat). Font Al-Qur'an dipasang di Part 03.
- **Breakpoint**: mobile <768 (bottom nav) · tablet 768–1279 (sidebar rail ikon) · desktop ≥1280 (sidebar penuh).

## Komponen (`src/components/ui`, `layout`, `navigation`, `shared`)

Button (+`buttonStyles`), IconButton, TextField (input), SearchInput, Card, StatCard, SectionHeader, PageHeader, Badge,
Avatar, DropdownMenu, Modal, BottomSheet, EmptyState, LoadingState (+PageSkeleton), Skeleton, Toast (`ToastProvider`),
Tooltip, ProgressBar, ProgressRing, Tabs, Switch, ThemeToggle, Alert, Spinner; Sidebar, TopBar, ProfileMenu,
BottomNavigation, NavLinks; SurahListItem, WeeklyActivityChart, PlaceholderNote.

## Tema (Terang / Gelap / Sistem)

`ThemeContext` menyimpan pilihan di `localStorage` (`lanila-tilawah-theme`), default **Terang**. Skrip di `index.html`
menerapkan tema sebelum render pertama (tanpa kedip). Mode **Sistem** mengikuti `prefers-color-scheme` secara langsung.
Pilihan juga ditulis ke `user_preferences.theme` bila memungkinkan (tidak dibaca balik di perangkat baru).

## Halaman

Beranda, Al-Qur'an (tab Surah/Juz), Audio (tab Qari/Surah), Belajar, Hafalan, Progres, Profil & Pengaturan.
Semua nilai statistik kosong ("—"/empty state), tidak ada data buatan. Daftar surah dan nama qari ditandai placeholder.
Fitur fase berikutnya membuka dialog "Segera hadir"; kontrol yang belum aktif (pemutar audio, switch notifikasi)
tampil nonaktif dan berlabel.

## Yang benar-benar berfungsi

Navigasi + rute aktif, tema 3 mode, menu profil (dropdown di tablet/desktop, bottom sheet di mobile), logout (auth Part 01),
edit nama profil, ganti kata sandi, tab, pencarian/filter surah dan qari, lazy-loading halaman dengan skeleton.

## Checklist verifikasi (belum dijalankan)

- [ ] `npm run build` tanpa error
- [ ] Regresi Part 01: daftar, masuk, lupa/reset sandi, refresh sesi, rute terproteksi, logout
- [ ] Lebar 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920: tanpa scroll horizontal, tidak tertutup bottom nav
- [ ] Terang/Gelap/Sistem di semua halaman, dialog, dropdown, toast; refresh mempertahankan tema
- [ ] Dialog/sheet: Esc, trap fokus, fokus kembali; Tabs: panah/Home/End
- [ ] Console bersih

## Keterbatasan

- Logo masih placeholder (ganti dengan aset resmi Lanila).
- Tidak ada navigasi panah di DropdownMenu (hanya Tab/Esc); Tooltip hanya hover/fokus.
- Tema belum dimuat dari database di perangkat baru.
- Pilihan bahasa hanya Indonesia; lokalisasi belum ada. Switch notifikasi nonaktif.
- Tidak ada test otomatis.

**Berikutnya: Part 03 — Quran Reader.** Jangan dimulai sebelum Part 02 direview.
