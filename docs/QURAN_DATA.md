# Data Al-Qur'an: riset sumber, lisensi, validasi, impor

Terakhir diperbarui: 23 November 2026. Ini bukan nasihat hukum.

Legenda bukti: **[V]** = dibaca langsung di halaman sumber · **[S]** = dari salinan sekunder (mis. repositori yang mengutip berkas lisensi) · **[A]** = asumsi / tidak diketahui.
Label status: VERIFIED · DOWNLOADED · VALIDATED · IMPORTED · MANUAL REVIEW REQUIRED · PERMISSION REQUIRED · BLOCKED.

## 0. Ringkasan status

| Item | Status |
| --- | --- |
| Sumber teks Arab dipilih (Tanzil, Uthmani) dan lisensinya dibaca | **VERIFIED** (teks lisensi **[S]**; konfirmasi di header berkas unduhan) |
| Sumber terjemahan Indonesia dipilih dan syaratnya dibaca | **VERIFIED** (syarat), penggunaan komersial **MANUAL REVIEW REQUIRED** |
| Terjemahan Tanzil `id.indonesian` | **PERMISSION REQUIRED** untuk penggunaan komersial |
| Unduh berkas teks Arab + metadata | **BLOCKED**: lingkungan penyusun tanpa internet; server Tanzil menolak akses otomatis ke berkas metadata. Unduh manual (bagian 5) |
| Unduh terjemahan | **BLOCKED** di lingkungan penyusun; skrip resmi siap: `npm run quran:fetch-translation` |
| Validasi data sebenarnya | **NOT RUN** (belum ada berkas). Validator diuji dengan data sintetis: 23/23 lulus |
| Impor ke database | **NOT RUN** |
| Verifikasi manual terhadap Mushaf cetak | **MANUAL REVIEW REQUIRED** |
| Uji pembaca setelah impor | **NOT RUN** |

Tabel acuan jumlah ayat per surah (`scripts/quran/expected-counts.json`) **dicocokkan 114/114 dan total 6.236** dengan indeks surah QuranEnc **[V]**.

## 1. Perbandingan sumber teks Arab

| Kriteria | A. Tanzil (rekomendasi) | B. AlQuran.Cloud (Islamic Network) | C. Quran Foundation API (quran.com) |
| --- | --- | --- | --- |
| Penyedia | Tanzil Project, sejak 2007 **[V]** | Islamic Network **[V]** | Quran Foundation **[V]** |
| Qur'an lengkap | Ya (114 surah) **[V]** | Ya **[V]**, daftar sumber di halaman Credits (tidak dibaca) | Ya **[A]**, lewat API |
| Aksara | Uthmani (menurut Mushaf Madinah), Imlaei/simple, dll. **[V]** | Beragam **[A]** | Beragam **[A]** |
| Riwayat | Mengacu pada Mushaf Madinah (Hafs) **[V]**, dinyatakan "diperiksa manual terhadap Mushaf Madinah" **[V]** | **[A]** | **[A]** |
| Metadata | Surah, juz, hizb, manzil, ruku, halaman Madinah, sajda (`quran-data.xml`, ver 1.0) **[V]** | Ada (juz/halaman) **[A]** | Ada **[A]** |
| Lisensi | CC BY 3.0; salinan verbatim, **mengubah dilarang** **[S]** | Teks boleh dipakai/disimpan/ditampilkan; **harus persis**; sebut sumber **[V]** | Terms of Service developer; **bukan** dataset yang boleh disalin **[V]** |
| Penggunaan komersial | Tidak ada klausul non-komersial pada teks lisensi yang dikutip; "dapat dipakai di situs/aplikasi apa pun" dengan atribusi **[S]**. Simpulan: diizinkan, tetap konfirmasi di header berkas | Tidak ada pembatasan pada teks Qur'an **[V]** (terjemahan/qari beda) | Boleh berbayar/langganan/iklan tanpa lisensi komersial terpisah, dengan syarat; **redistribusi data butuh lisensi komersial tertulis** **[V]** |
| Atribusi | Sebut Tanzil.net + tautan ke http://tanzil.net + pemberitahuan hak cipta **[S]** | Cantumkan sumber **[V]** | Sesuai ToS **[V]** |
| Format unduhan | txt, txt-2 (dengan nomor ayat), xml, sql **[S]** | REST API tanpa kunci **[V]** | API + kredensial dari Developer Console **[V]** |
| Cocok dengan pipeline impor ke DB sendiri | **Ya** | Bergantung sumber asli (tidak dibaca) | **Tidak disarankan**: aturan penyimpanan/redistribusi belum dibaca penuh, butuh kredensial, larangan scraping **[V]** |
| Rekomendasi | **Dipakai** | Cadangan/pembanding (setelah baca halaman Credits) | Tidak dipakai untuk impor |

Tautan: https://tanzil.net/docs/tanzil_project · http://tanzil.net/download/ · https://tanzil.net/docs/Quran_Metadata · https://alquran.cloud/terms-and-conditions · https://api-docs.quran.foundation/legal/developer-terms/

Catatan penting Tanzil: teks hanya boleh disalin **apa adanya**. Pipeline ini tidak pernah menormalisasi, memperbaiki, atau mengubah teks; hanya `\r` akhir baris dan BOM berkas yang dibuang (artefak berkas, bukan isi).

## 2. Perbandingan terjemahan Indonesia

| Kriteria | A. Kemenag via QuranEnc (rekomendasi, bersyarat) | B. Tanzil `id.indonesian` | C. Kemenag langsung (quran.kemenag.go.id) |
| --- | --- | --- | --- |
| Pemegang hak/penerjemah | Kementerian Agama RI (LPMQ) **[V]** | Kementerian Agama RI **[V]** | Kementerian Agama RI, LPMQ (Al-Qur'an dan Terjemahnya, edisi penyempurnaan 2019) **[V]** |
| Penerbit/distributor | QuranEnc.com (Encyclopedia of the Noble Quran) **[V]** | Tanzil.net **[V]** | LPMQ **[V]** |
| Lengkap 114 surah | Ya; indeks 114 surah, 6.236 ayat **[V]** | Ya **[A]** | Ya **[A]** |
| Format | JSON per surah via API resmi; CSV/XLS/XML **[V]** (struktur CSV/XML belum dilihat) | txt `sura\|aya\|teks` **[A]** | Tidak ada unduhan data terdokumentasi yang ditemukan |
| Identifier | `sura`, `aya` (+ `translation`, `footnotes`) **[V]** | sura/aya **[A]** | - |
| Syarat penggunaan | 7 syarat re-publish (di bawah) **[V]** | **Hanya non-komersial**; selain itu perlu izin penerjemah/penerbit; tanpa jaminan akurasi **[V]** | Tidak ditemukan syarat tertulis untuk penggunaan data; **[A]** |
| Penggunaan komersial | Tidak dinyatakan eksplisit; tidak ada klausul "non-komersial" pada syarat yang dibaca → **MANUAL REVIEW REQUIRED** | **PERMISSION REQUIRED** | **PERMISSION REQUIRED** (tidak ada prosedur resmi yang ditemukan; kontak LPMQ di bawah) |
| Atribusi | Sebut penerbit dan sumber (QuranEnc.com); sebut versi; pertahankan informasi transkrip **[V]** | Sebut penerjemah/sumber **[A]** | - |

**Syarat QuranEnc [V]** (https://quranenc.com/en/browse/indonesian_affairs): (1) tidak mengubah/menambah/menghapus isi; (2) menyebut penerbit dan sumber (QuranEnc.com); (3) menyebut nomor versi saat re-publish; (4) mempertahankan informasi transkrip; (5) memberi tahu sumber bila ada catatan; (6) memperbarui sesuai versi terbaru; (7) tanpa iklan yang tidak pantas di dekat terjemahan.

Implikasi untuk proyek ini:
- **Catatan kaki**: syarat (1) berarti catatan kaki tidak boleh dibuang. Pipeline menyimpannya (`quran_translations.footnotes`), tetapi **UI belum menampilkannya**. Putuskan: tampilkan, atau minta konfirmasi bahwa menyembunyikan di UI tidak melanggar.
- **Versi**: isi `--translation-version` saat impor (ambil dari halaman sumber); atribusi di UI menampilkannya.
- **Iklan**: bila nanti ada iklan, jangan tempatkan di dekat terjemahan.
- **Pembaruan**: jadwalkan pengecekan versi terbaru berkala.

Keputusan lisensi (rekomendasi, bukan nasihat hukum):
1. Rilis dengan **teks Arab saja** bila konfirmasi belum ada. Pipeline mendukungnya.
2. Kirim permintaan konfirmasi tertulis (templat: `docs/PERMISSION_REQUEST_TEMPLATE.md`) ke QuranEnc (formulir "Contact Us" di situsnya) dan LPMQ Kemenag (alamat resmi di jurnal Suhuf LPMQ: lajnah@kemenag.go.id; situs lajnah.kemenag.go.id). Tanyakan juga apakah aplikasi Qur'an digital memerlukan proses pentashihan (tashih.kemenag.go.id); saya tidak menemukan aturan itu secara pasti, jadi jangan dianggap ada atau tidak ada.
3. Jangan pakai terjemahan Tanzil `id.indonesian` untuk produk komersial tanpa izin.

## 3. Konvensi penomoran

Hafs/Kufi: 114 surah, 6.236 ayat; basmalah di awal surah (selain Al-Fatihah dan At-Taubah) tampil terpisah dan diambil dari data ayat 1:1, bukan ayat bernomor. Validator memberi error bila ayat 1 surah lain diawali basmalah (agar tidak tampil ganda).

## 4. Struktur berkas

```
data/quran-source/
  original/      berkas asli hasil unduhan (JANGAN diedit/ditimpa; tidak di-commit; MANIFEST.json berisi SHA-256)
  processed/     keluaran transformasi bila diperlukan (saat ini tidak ada transformasi)
  SOURCES.json   catatan sumber, versi, tanggal, lisensi, status
  README.md
data/quran-build/   laporan validasi (validation-report.json, cross-dataset-report.json)
```

## 5. Langkah unduh, validasi, impor

Unduh manual (browser):
1. Teks: http://tanzil.net/download/ → Quran type **Uthmani**, output **Text (with aya numbers)** (`txt-2`). Simpan `original/quran-uthmani.txt`. Catat pilihan opsi (pause marks, sajdah, rub-el-hizb; bawaan perpustakaan unduhan = aktif) di `SOURCES.json`.
2. Metadata: http://tanzil.net/res/text/metadata/quran-data.xml → `original/quran-data.xml`.
3. Terjemahan (hanya setelah keputusan lisensi): `npm run quran:fetch-translation` (API resmi QuranEnc; tidak menimpa berkas yang sudah ada).

Lalu:
```
npm run quran:record      # SHA-256 semua berkas asli -> original/MANIFEST.json
npm run quran:validate    # Arab + metadata saja
npm run quran:validate -- --accept-translation-terms --translation-format quranenc --translation-version <versi>
npm run quran:import -- --text-version <versi/tanggal> --text-date <YYYY-MM-DD>                          # hanya Arab
npm run quran:import -- --text-version ... --accept-translation-terms --translation-format quranenc --translation-version <versi> --translation-date <YYYY-MM-DD>
```
(`.env.local` berisi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`; jangan diawali `VITE_` dan jangan di-commit.) Jalankan migrasi `20260102…` dan `20260103…` lebih dulu.

## 6. Yang diperiksa validator

114 surah dan urutannya; 6.236 ayat; jumlah ayat per surah **tiga arah** (teks, metadata Tanzil, tabel acuan); penomoran berurutan tanpa celah; duplikat; teks kosong; huruf Latin pada teks Arab; pola basmalah pada ayat 1 (dicatat, bukan error); 30 juz dan 604 halaman (referensi ada, urutan naik, mulai 1:1); kelengkapan dan kecocokan terjemahan per `surah:ayat` (bukan kemiripan teks atau posisi). `cross-dataset-report.json` mendaftar setiap ayat yang hilang/berlebih/duplikat/kosong.

`node scripts/quran/selftest.mjs` menguji validator dengan data sintetis (bukan Al-Qur'an): 23 pengujian.

## 7. Verifikasi manual (wajib, belum dilakukan)

Lulus validasi otomatis bukan bukti teks benar. Setelah impor, bandingkan dengan Mushaf cetak (Madinah/Standar Indonesia): 1:1–7; 2:255; 36:1; 55:1; 112–114; ayat pertama dan terakhir tiap juz; ayat sajdah. Catat tanggal, pemeriksa, dan hasilnya di bawah ini.

| Tanggal | Pemeriksa | Sampel | Hasil |
| --- | --- | --- | --- |
| | | | |

## 8. Keterbatasan

- Format `quran-uthmani.txt` (txt-2) dan `quran-data.xml` belum dilihat langsung; parser gagal keras bila beda. Struktur respons QuranEnc: pembungkus (`result`?) belum dilihat; parser menerima beberapa bentuk dan gagal keras bila tidak cocok.
- Teks lisensi Tanzil dibaca dari salinan sekunder; halaman unduhan Tanzil sendiri tidak diakses otomatis.
- Arti surah bahasa Indonesia (`meaning_indonesian`) kosong; metadata Tanzil hanya punya arti Inggris.
- Catatan kaki terjemahan disimpan tetapi belum ditampilkan di UI.
