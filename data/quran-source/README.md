# Berkas sumber data Al-Qur'an (diunduh manual)

Folder ini sengaja kosong. Unduh berkas berikut dari sumber resminya, JANGAN ubah isinya sama sekali
(lisensi melarang perubahan), lalu taruh dengan nama persis seperti di bawah.

| Berkas | Sumber | Catatan |
| --- | --- | --- |
| `quran-uthmani.txt` | https://tanzil.net/download/ → Quran Type: **Uthmani**, Output: **Text (with aya numbers)** | Format `sura\|aya\|teks`. Biarkan opsi tanda baca/pause/sajda pada pengaturan bawaan dan catat pilihanmu. |
| `quran-data.xml` | https://tanzil.net/docs/Quran_Metadata (tautan `quran-data.xml`) | Metadata surah, juz, halaman Mushaf Madinah. |
| `id.indonesian.txt` | https://tanzil.net/trans/id.indonesian (opsional) | Terjemahan Kemenag RI. **Hanya untuk non-komersial**, lihat docs/QURAN_DATA.md. |

Catat versi/tanggal unduhan, lalu jalankan:

```bash
npm run quran:validate            # validasi saja
npm run quran:import              # validasi + unggah (butuh .env.local, lihat docs/QURAN_DATA.md)
```

Isi folder ini diabaikan Git (`.gitignore`) kecuali README ini.
