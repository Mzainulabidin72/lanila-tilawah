# Berkas sumber data Al-Qur'an

Lihat **docs/QURAN_DATA.md** (riset sumber, lisensi, langkah lengkap) dan **SOURCES.json** (catatan versi/tanggal/status).

Struktur:
- `original/`: berkas asli hasil unduhan. **Jangan diedit atau ditimpa.** Isinya tidak di-commit; hanya `MANIFEST.json` (SHA-256) yang boleh.
- `processed/`: keluaran transformasi (saat ini tidak ada transformasi).

Berkas yang dibutuhkan (nama persis):

| Berkas | Sumber |
| --- | --- |
| `original/quran-uthmani.txt` | http://tanzil.net/download/ → Uthmani, Text (with aya numbers) |
| `original/quran-data.xml` | http://tanzil.net/res/text/metadata/quran-data.xml |
| `original/quranenc-indonesian_affairs/{1..114}.json` | `npm run quran:fetch-translation` (API resmi QuranEnc), **hanya setelah keputusan lisensi** |
| `original/id.indonesian.txt` | alternatif Tanzil, **hanya non-komersial** |

Setelah mengunduh: `npm run quran:record`, lalu `npm run quran:validate`. Isi tanggal, versi, dan checksum di `SOURCES.json`.
