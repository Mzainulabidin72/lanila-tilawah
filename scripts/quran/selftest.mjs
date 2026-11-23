// Uji skrip validator dengan data SINTETIS. Isinya BUKAN Al-Qur'an dan tidak pernah dikirim ke database.
// Teks "Arab" sintetis hanyalah huruf alif berulang agar lolos pemeriksaan aksara.
import { readFileSync } from 'node:fs'
import { parseVerseFile, parseMetadata, validateDataset, parseQuranEncSura, crossCheck } from './lib.mjs'

const counts = JSON.parse(readFileSync(new URL('./expected-counts.json', import.meta.url), 'utf8')).counts
const FAKE = '\u0627\u0627\u0627'
const refs = []
counts.forEach((n, i) => { for (let a = 1; a <= n; a++) refs.push([i + 1, a]) })
const total = refs.length
const startAt = (k, of) => refs[Math.floor(((k - 1) * total) / of)]

const buildText = (mut = (x) => x) => mut(refs.map(([s, a]) => `${s}|${a}|${FAKE}`)).join('\n') + '\n'
const buildXml = (mut = (x) => x) => {
  const suras = counts.map((n, i) => `<sura index="${i + 1}" ayas="${n}" start="0" name="${FAKE}" tname="Sintetis ${i + 1}" ename="Synthetic" type="${i % 2 ? 'Medinan' : 'Meccan'}" order="${i + 1}" rukus="1" />`)
  const juz = Array.from({ length: 30 }, (_, k) => { const [s, a] = startAt(k + 1, 30); return `<juz index="${k + 1}" sura="${s}" aya="${a}" />` })
  const pages = Array.from({ length: 604 }, (_, k) => { const [s, a] = startAt(k + 1, 604); return `<page index="${k + 1}" sura="${s}" aya="${a}" />` })
  return mut(`<quran><suras>${suras.join('')}</suras><juzs>${juz.join('')}</juzs><pages>${pages.join('')}</pages></quran>`)
}

const run = (textMut, xmlMut, transMut) => {
  const ayahs = parseVerseFile(buildText(textMut), 'teks')
  const meta = parseMetadata(buildXml(xmlMut))
  const translation = transMut ? parseVerseFile(transMut(refs.map(([s, a]) => `${s}|${a}|terjemahan sintetis`)).join('\n'), 'terjemahan') : null
  return validateDataset({ ayahs, meta, expectedCounts: counts, translation })
}

let failed = 0
const expectOk = (name, r) => { const ok = r.errors.length === 0; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) { failed++; console.log('   ', r.errors.slice(0, 3)) } }
const expectErr = (name, r, needle) => {
  const ok = r.errors.some((e) => e.includes(needle)); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) { failed++; console.log('    diharapkan mengandung:', needle, '| didapat:', r.errors.slice(0, 3)) }
}

expectOk('dataset sintetis valid (114 surah, 6236 ayat, 30 juz, 604 halaman, terjemahan)', run(undefined, undefined, (x) => x))
expectErr('ayat hilang terdeteksi', run((l) => l.filter((_, i) => i !== 100)), 'tidak berurutan')
expectErr('jumlah total salah terdeteksi', run((l) => l.slice(0, -1)), '6236')
expectErr('duplikat terdeteksi', run((l) => [...l, l[5]]), 'duplikat')
expectErr('teks kosong terdeteksi', run((l) => l.map((x, i) => (i === 7 ? x.split('|').slice(0, 2).join('|') + '|' : x))), 'kosong')
expectErr('huruf Latin pada teks Arab terdeteksi', run((l) => l.map((x, i) => (i === 9 ? x + 'abc' : x))), 'huruf Latin')
expectErr('urutan salah terdeteksi', run((l) => { const c = [...l]; [c[20], c[21]] = [c[21], c[20]]; return c }), 'urutan salah')
expectErr('surah hilang terdeteksi', run((l) => l.filter((x) => !x.startsWith('50|'))), 'surah 50')
expectErr('referensi surah tidak valid terdeteksi', run((l) => [...l, '115|1|' + FAKE]), 'referensi surah tidak valid')
expectErr('selisih metadata vs teks terdeteksi', run(undefined, (x) => x.replace('ayas="7"', 'ayas="8"')), 'metadata Tanzil')
expectErr('juz di luar jangkauan terdeteksi', run(undefined, (x) => x.replace(/<juz index="2" sura="\d+" aya="\d+" \/>/, '<juz index="2" sura="1" aya="99" />')), 'tidak ada pada teks')
expectErr('jumlah juz salah terdeteksi', run(undefined, (x) => x.replace(/<juz index="30"[^>]*\/>/, '')), 'Juz: 29')
expectErr('jumlah halaman salah terdeteksi', run(undefined, (x) => x.replace(/<page index="604"[^>]*\/>/, '')), 'Halaman: 603')
expectErr('tipe tempat turun tidak dikenal terdeteksi', run(undefined, (x) => x.replace('type="Meccan"', 'type="Unknown"')), 'tidak dikenal')
expectErr('basmalah menempel di ayat 1 terdeteksi', run((l) => l.map((x) => (x.startsWith('2|1|') ? x + FAKE : x)).map((x) => (x.startsWith('2|1|') ? x.replace('2|1|', '2|1|' + FAKE) : x))), 'basmalah')
expectErr('terjemahan hilang terdeteksi', run(undefined, undefined, (l) => l.filter((_, i) => i !== 3)), 'Terjemahan: 1:4')

// --- parser QuranEnc + pencocokan silang ---
const expectThrow = (name, fn, needle) => {
  let msg = null
  try { fn() } catch (e) { msg = e.message }
  const ok = msg !== null && msg.includes(needle)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) { failed++; console.log('    didapat:', msg) }
}
const qe = (arr) => JSON.stringify({ result: arr })
const okRows = parseQuranEncSura(qe([{ sura: '1', aya: '1', translation: 't1', footnotes: '' }, { sura: '1', aya: '2', translation: 't2', footnotes: 'catatan' }]), 1, 'x')
const qeOk = okRows.length === 2 && okRows[0].footnotes === null && okRows[1].footnotes === 'catatan' && okRows[1].text === 't2'
console.log(`${qeOk ? 'PASS' : 'FAIL'}  parser QuranEnc: teks dan catatan kaki dipertahankan apa adanya`); if (!qeOk) failed++
expectThrow('parser QuranEnc: nomor surah salah ditolak', () => parseQuranEncSura(qe([{ sura: '2', aya: '1', translation: 't' }]), 1, 'x'), 'diharapkan 1')
expectThrow('parser QuranEnc: entri tanpa translation ditolak', () => parseQuranEncSura(qe([{ sura: '1', aya: '1' }]), 1, 'x'), 'tidak memiliki')
expectThrow('parser QuranEnc: bukan JSON ditolak', () => parseQuranEncSura('<html>', 1, 'x'), 'bukan JSON')
const ay = [{ surah: 1, ayah: 1, text: 'a' }, { surah: 1, ayah: 2, text: 'b' }]
const cc = crossCheck(ay, [{ surah: 1, ayah: 1, text: 't' }, { surah: 1, ayah: 1, text: 't' }, { surah: 2, ayah: 1, text: ' ' }])
const ccOk = cc.matched === 1 && cc.missingTranslation[0] === '1:2' && cc.translationWithoutArabic[0] === '2:1' && cc.duplicates[0] === '1:1' && cc.emptyTranslation[0] === '2:1'
console.log(`${ccOk ? 'PASS' : 'FAIL'}  crossCheck: hilang, kelebihan, duplikat, dan kosong dilaporkan per surah:ayat`); if (!ccOk) { failed++; console.log(cc) }

let threw = false
try { parseMetadata('<quran></quran>') } catch { threw = true }
console.log(`${threw ? 'PASS' : 'FAIL'}  skema metadata tidak sesuai ditolak`); if (!threw) failed++
try { parseVerseFile('bukan format', 'x') ; console.log('FAIL  format baris salah ditolak'); failed++ } catch { console.log('PASS  format baris salah ditolak') }

console.log(failed ? `\n${failed} pengujian GAGAL` : '\nSemua pengujian validator lulus')
process.exit(failed ? 1 : 0)
