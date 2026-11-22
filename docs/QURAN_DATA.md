# Data Al-Qur'an: sumber, lisensi, validasi

## Status saat ini

**Belum ada data Al-Qur'an yang diimpor.** Lingkungan pengembangan tempat kode ini ditulis tidak punya akses internet,
dan teks Al-Qur'an tidak boleh ditulis atau dibuat dari ingatan/AI. Pembaca tampil sebagai "data belum tersedia"
sampai dataset diimpor dan lolos validasi (kolom `quran_dataset_info.validated = true`).

## Sumber yang dipilih

| Bagian | Sumber | Lisensi (hasil pembacaan halaman sumber) |
| --- | --- | --- |
| Teks Arab (Uthmani) | Tanzil Project, https://tanzil.net/download/ | Creative Commons Attribution 3.0. Boleh disalin/didistribusikan **verbatim**; **mengubah teks tidak diizinkan**. Wajib mencantumkan sumber (Tanzil.net) dan menautkan ke http://tanzil.net. |
| Metadata (surah, juz, halaman Madinah) | Tanzil Quran Metadata, `quran-data.xml`, https://tanzil.net/docs/Quran_Metadata | Satu keluarga dengan teks Tanzil. Ketentuan spesifik berkas metadata belum dibaca terpisah; anggap sama dengan teks sampai dikonfirmasi. |
| Terjemahan Indonesia | Tanzil `id.indonesian`, "Bahasa Indonesia", Indonesian Ministry of Religious Affairs | Tanzil: terjemahan **hanya untuk tujuan non-komersial**; penggunaan lain memerlukan izin penerjemah/penerbit. Tanzil tidak menjamin akurasi. Terjemahan Kemenag yang sama juga tersedia di QuranEnc.com dengan syarat: tidak diubah/ditambah/dihapus dan wajib mencantumkan penerbit dan sumber. |

**Keputusan yang harus diambil pemilik produk:** apakah Lanila Tilawah bersifat non-komersial. Bila ya, terjemahan boleh dipakai
dengan atribusi. Bila tidak (atau tidak yakin), minta izin Kemenag/penerbit sebelum mengimpor terjemahan. Impor terjemahan
sengaja butuh flag eksplisit `--accept-translation-terms`.

Konvensi penomoran: Hafs/Kufi, 114 surah, 6.236 ayat (basmalah di awal surah selain Al-Fatihah dan At-Taubah bukan ayat bernomor).

## Langkah impor

1. Unduh berkas (lihat `data/quran-source/README.md`), jangan diedit.
2. `npm run quran:validate` — harus menampilkan `✓ Validasi lulus`. Laporan: `data/quran-build/validation-report.json`.
3. Buat `.env.local` (tidak ikut Git):
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...   # RAHASIA. Jangan pernah diawali VITE_, jangan di-commit.
   ```
4. Jalankan migrasi `20260102000000_quran_reader.sql`, lalu `npm run quran:import` (tambahkan `-- --accept-translation-terms` bila terjemahan dipakai dan lisensi sudah dikonfirmasi; opsional `-- --text-version <tanggal-unduh>`).
5. Skrip menandai `validated=false` sebelum menulis, memverifikasi hitungan di database (114/6236/30), baru menandai `validated=true`.

## Yang diperiksa validator (`scripts/quran/lib.mjs`)

114 surah dan urutannya; 6.236 ayat; jumlah ayat per surah dibandingkan **tiga arah** (teks, metadata Tanzil, tabel acuan);
penomoran ayat berurutan tanpa celah; duplikat; teks kosong; huruf Latin pada teks Arab (mencegah data placeholder masuk);
basmalah yang menempel di ayat 1; 30 juz dan 604 halaman (referensi ada, posisi naik, mulai 1:1); kelengkapan terjemahan.
Teks tidak pernah dinormalisasi atau dikoreksi.

Validator diuji dengan data sintetis: `node scripts/quran/selftest.mjs` (18 pengujian).

## Batasan yang jujur

- Format `quran-data.xml` dan `quran-uthmani.txt` diasumsikan dari dokumentasi/pengetahuan umum, **belum dilihat langsung**.
  Bila skema berbeda, parser gagal keras dengan pesan jelas (tidak menebak).
- Tabel acuan jumlah ayat (`expected-counts.json`) berasal dari data sementara Part 02 dan belum diverifikasi independen per surah.
  Karena itu selisih dilaporkan sebagai ERROR untuk ditinjau manusia.
- Arti surah dalam bahasa Indonesia (`meaning_indonesian`) dibiarkan kosong: Tanzil hanya menyediakan arti Inggris (`ename`).
- Bukan pengganti verifikasi manual: setelah impor, bandingkan sampel (mis. 1:1–7, 2:255, 112, 114, akhir tiap juz) dengan Mushaf cetak.
