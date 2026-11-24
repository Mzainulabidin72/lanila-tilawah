#!/usr/bin/env node
// Validasi + impor dataset Al-Qur'an. Dijalankan LOKAL oleh pengembang (bukan di browser).
//
//   npm run quran:validate   -> validasi saja, tanpa jaringan
//   npm run quran:import     -> validasi, lalu unggah ke Supabase (butuh SUPABASE_SERVICE_ROLE_KEY di .env.local)
//
// Terjemahan hanya diproses bila diberi --accept-translation-terms (keputusan lisensi eksplisit):
//   --translation-format tanzil     (berkas id.indonesian.txt; Tanzil: hanya NON-KOMERSIAL)
//   --translation-format quranenc   (folder JSON per surah dari scripts/quran/fetch-quranenc.mjs)
// Panduan: docs/QURAN_DATA.md
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseVerseFile, parseMetadata, parseQuranEncSura, validateDataset, crossCheck, buildRecords, sha256, EXPECTED } from './lib.mjs'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d }
const firstExisting = (...ps) => resolve(ps.find((p) => existsSync(p)) ?? ps[0])

const textPath = opt('text') ? resolve(opt('text')) : firstExisting('data/quran-source/original/quran-uthmani.txt', 'data/quran-source/quran-uthmani.txt')
const metaPath = opt('meta') ? resolve(opt('meta')) : firstExisting('data/quran-source/original/quran-data.xml', 'data/quran-source/quran-data.xml')
const transFormat = opt('translation-format', 'tanzil')
const transPath = opt('translation') ? resolve(opt('translation')) : firstExisting('data/quran-source/original/id.indonesian.txt', 'data/quran-source/id.indonesian.txt')
const transDir = resolve(opt('translation-dir', 'data/quran-source/original/quranenc-indonesian_affairs'))
const upload = flag('upload')
const withTranslation = flag('accept-translation-terms')
const meta0 = {
  textVersion: opt('text-version', null), textDate: opt('text-date', null),
  translationVersion: opt('translation-version', null), translationDate: opt('translation-date', null),
}

const read = (p, what) => {
  try { return readFileSync(p, 'utf8') } catch { console.error(`✗ ${what} tidak ditemukan: ${p}\n  Lihat data/quran-source/README.md.`); process.exit(2) }
}

const textRaw = read(textPath, "Berkas teks Al-Qur'an")
const metaRaw = read(metaPath, 'Berkas metadata')
const ayahs = parseVerseFile(textRaw, 'teks')
const meta = parseMetadata(metaRaw)
const expectedCounts = JSON.parse(readFileSync(new URL('./expected-counts.json', import.meta.url), 'utf8')).counts

let translation = null
let transChecksum = null
if (withTranslation) {
  if (transFormat === 'quranenc') {
    translation = []
    const raws = []
    for (let n = 1; n <= EXPECTED.surahs; n++) {
      const raw = read(`${transDir}/${n}.json`, `Terjemahan surah ${n}`)
      raws.push(raw)
      translation.push(...parseQuranEncSura(raw, n, `terjemahan surah ${n}`))
    }
    transChecksum = sha256(raws.join('\n'))
  } else if (transFormat === 'tanzil') {
    const raw = read(transPath, 'Berkas terjemahan')
    translation = parseVerseFile(raw, 'terjemahan')
    transChecksum = sha256(raw)
  } else { console.error(`✗ --translation-format tidak dikenal: ${transFormat}`); process.exit(2) }
}

const { errors, warnings, stats } = validateDataset({ ayahs, meta, expectedCounts, translation })
const cross = translation ? crossCheck(ayahs, translation) : null
const report = {
  generatedAt: new Date().toISOString(), stats, errors, warnings,
  files: { text: sha256(textRaw), metadata: sha256(metaRaw), translation: transChecksum },
}
mkdirSync('data/quran-build', { recursive: true })
writeFileSync('data/quran-build/validation-report.json', JSON.stringify(report, null, 2))
if (cross) writeFileSync('data/quran-build/cross-dataset-report.json', JSON.stringify(cross, null, 2))

console.log(`Surah: ${stats.surahs}/${EXPECTED.surahs} | Ayat: ${stats.ayahs}/${EXPECTED.ayahs} | Juz: ${stats.juz}/${EXPECTED.juz} | Halaman: ${stats.pages}/${EXPECTED.pages}` + (stats.translation ? ` | Terjemahan: ${stats.translation.total}` : ' | Terjemahan: dilewati'))
if (stats.basmalah) console.log(`Basmalah di dalam teks ayat 1: ${stats.basmalah.prefixed.length} surah (konvensi Tanzil: semua selain 1 dan 9)`)
if (cross) console.log(`Pencocokan Arab↔terjemahan: ${cross.matched}/${cross.arabicCount} cocok | tanpa terjemahan: ${cross.missingTranslation.length} | terjemahan tanpa ayat Arab: ${cross.translationWithoutArabic.length} | duplikat: ${cross.duplicates.length} | kosong: ${cross.emptyTranslation.length}  (rincian: data/quran-build/cross-dataset-report.json)`)
if (warnings.length) console.log(`\nPeringatan (${warnings.length}):\n- ` + warnings.slice(0, 20).join('\n- '))
if (errors.length) {
  console.error(`\n✗ VALIDASI GAGAL (${errors.length} error). Tidak ada yang diimpor.\n- ` + errors.slice(0, 40).join('\n- ') + (errors.length > 40 ? `\n… dan ${errors.length - 40} lainnya (lihat data/quran-build/validation-report.json)` : ''))
  process.exit(1)
}
console.log('\n✓ Validasi lulus. Laporan: data/quran-build/validation-report.json')
console.log('  Ingat: lulus validasi otomatis BUKAN bukti teks benar. Lakukan verifikasi manual terhadap Mushaf cetak.')
if (!upload) process.exit(0)

// ---------------- unggah ke Supabase (service_role, hanya lokal) ----------------
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('✗ Perlu SUPABASE_URL (atau VITE_SUPABASE_URL) dan SUPABASE_SERVICE_ROLE_KEY di .env (JANGAN diawali VITE_, jangan di-commit, jangan disalin ke Vercel).'); process.exit(2) }
// Cegah salah pakai: kunci anon tidak bisa menulis data master (dan bukan kunci yang dimaksud).
try {
  const role = key.startsWith('sb_secret_') ? 'service_role' : JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role
  if (role !== 'service_role') { console.error(`✗ Kunci pada SUPABASE_SERVICE_ROLE_KEY berperan "${role}", bukan service_role. Ambil kunci service_role/secret dari Supabase Dashboard > Project Settings > API Keys.`); process.exit(2) }
} catch { console.error('✗ Format SUPABASE_SERVICE_ROLE_KEY tidak dikenali (harus kunci service_role atau sb_secret_...).'); process.exit(2) }
const { createClient } = await import('@supabase/supabase-js')
const db = createClient(url, key, { auth: { persistSession: false } })
const must = async (p, what) => { const { error } = await p; if (error) { console.error(`✗ ${what}: ${error.message}`); process.exit(3) } }

const T = transFormat === 'quranenc'
  ? {
      language: 'id', translator: 'Indonesian Translation - Ministry of Religious Affairs (Kementerian Agama RI)',
      source: 'QuranEnc.com, key indonesian_affairs (https://quranenc.com/en/browse/indonesian_affairs)',
      sourceUrl: 'https://quranenc.com/en/browse/indonesian_affairs',
      license: 'Syarat QuranEnc: tanpa ubah/tambah/hapus; cantumkan penerbit dan sumber (QuranEnc.com); sebut nomor versi; pertahankan informasi transkrip; laporkan catatan ke sumber; ikuti versi terbaru; tanpa iklan tidak pantas. Penggunaan komersial belum dikonfirmasi tertulis.',
      attribution: 'Terjemahan: Kementerian Agama RI, diterbitkan melalui QuranEnc.com (https://quranenc.com/en/browse/indonesian_affairs)',
    }
  : {
      language: 'id', translator: 'Indonesian Ministry of Religious Affairs',
      source: 'Tanzil.net id.indonesian (https://tanzil.net/trans/)', sourceUrl: 'https://tanzil.net/trans/',
      license: 'Tanzil: hanya untuk tujuan non-komersial; selain itu perlu izin penerjemah/penerbit',
      attribution: 'Terjemahan: Kementerian Agama RI, melalui Tanzil.net (https://tanzil.net/trans/)',
    }
const rec = buildRecords({ ayahs, meta, translation, translationInfo: T })

await must(db.from('quran_dataset_info').update({ validated: false }).eq('id', 1), 'reset status validasi')
await must(db.from('quran_surahs').upsert(rec.surahRows, { onConflict: 'id' }), 'surah')
for (let i = 0; i < rec.ayahRows.length; i += 500) {
  await must(db.from('quran_ayahs').upsert(rec.ayahRows.slice(i, i + 500), { onConflict: 'id' }), `ayat ${i}`)
  process.stdout.write(`\rAyat: ${Math.min(i + 500, rec.ayahRows.length)}/${rec.ayahRows.length}`)
}
console.log('')
await must(db.from('quran_juz').upsert(rec.juzRows, { onConflict: 'juz_number' }), 'juz')
for (let i = 0; i < rec.translationRows.length; i += 500) {
  await must(db.from('quran_translations').upsert(rec.translationRows.slice(i, i + 500), { onConflict: 'ayah_id,language_code,translator_name' }), `terjemahan ${i}`)
}

const count = async (t) => { const { count: c, error } = await db.from(t).select('*', { count: 'exact', head: true }); if (error) throw error; return c }
const [cs, ca, cj] = [await count('quran_surahs'), await count('quran_ayahs'), await count('quran_juz')]
if (cs !== EXPECTED.surahs || ca !== EXPECTED.ayahs || cj !== EXPECTED.juz) { console.error(`✗ Hitungan di database tidak sesuai (surah ${cs}, ayat ${ca}, juz ${cj}). Status tetap belum valid.`); process.exit(4) }
if (translation) {
  const ct = await count('quran_translations')
  if (ct < EXPECTED.ayahs) { console.error(`✗ Terjemahan di database ${ct} (< ${EXPECTED.ayahs}). Status tetap belum valid.`); process.exit(4) }
}

await must(db.from('quran_dataset_info').update({
  validated: true, validated_at: new Date().toISOString(), validation_summary: { ...report.stats, cross },
  numbering_convention: 'Hafs / Kufi (6236 ayat), urutan mushaf Madinah',
  total_surah: cs, total_ayah: ca,
  text_source: 'Tanzil Quran Text (Uthmani) — https://tanzil.net', text_version: meta0.textVersion, text_downloaded_at: meta0.textDate,
  text_license: 'Creative Commons Attribution 3.0; salinan verbatim, tidak boleh diubah',
  text_attribution: 'Tanzil Quran Text © Tanzil Project, https://tanzil.net', text_sha256: report.files.text, metadata_sha256: report.files.metadata,
  translation_language: translation ? T.language : null, translation_translator: translation ? T.translator : null,
  translation_license: translation ? T.license : null, translation_attribution: translation ? T.attribution : null,
  translation_sha256: transChecksum, translation_version: translation ? meta0.translationVersion : null,
  translation_source_url: translation ? T.sourceUrl : null, translation_downloaded_at: translation ? meta0.translationDate : null,
}).eq('id', 1), 'dataset_info')
console.log('✓ Impor selesai dan status dataset = validated.')
