#!/usr/bin/env node
// Mengunduh terjemahan Kemenag dari API RESMI QuranEnc (layanan developer yang didokumentasikan di situsnya),
// satu berkas JSON per surah, disimpan APA ADANYA. Dijalankan lokal oleh pengembang.
//   node scripts/quran/fetch-quranenc.mjs [--key indonesian_affairs] [--out data/quran-source/original/quranenc-indonesian_affairs]
// Tidak menimpa berkas yang sudah ada (berkas asli dipertahankan). Jeda antar permintaan agar tidak membebani server.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

const args = process.argv.slice(2)
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d }
const key = opt('key', 'indonesian_affairs')
const out = opt('out', `data/quran-source/original/quranenc-${key}`)
mkdirSync(out, { recursive: true })

const log = []
for (let n = 1; n <= 114; n++) {
  const file = `${out}/${n}.json`
  if (existsSync(file)) { log.push({ sura: n, status: 'skipped-exists', sha256: createHash('sha256').update(readFileSync(file)).digest('hex') }); continue }
  const url = `https://quranenc.com/api/v1/translation/sura/${key}/${n}`
  const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'LanilaTilawah-dataset-fetch/1.0' } })
  if (!res.ok) { console.error(`✗ ${url} -> HTTP ${res.status}. Dihentikan; tidak ada data parsial yang dianggap valid.`); process.exit(1) }
  const body = await res.text()
  writeFileSync(file, body)
  log.push({ sura: n, url, status: 'downloaded', bytes: Buffer.byteLength(body), sha256: createHash('sha256').update(body).digest('hex') })
  process.stdout.write(`\rSurah ${n}/114`)
  await new Promise((r) => setTimeout(r, 600))
}
writeFileSync(`${out}/FETCH_LOG.json`, JSON.stringify({ key, fetchedAt: new Date().toISOString(), source: 'https://quranenc.com/en/browse/' + key, files: log }, null, 2))
console.log(`\n✓ Selesai. Catat versi terjemahan dari halaman sumber, lalu jalankan: npm run quran:record`)
