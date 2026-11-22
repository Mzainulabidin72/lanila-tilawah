// Parser + validator dataset Al-Qur'an (Tanzil). Fungsi murni, tanpa jaringan.
// ATURAN: teks Al-Qur'an TIDAK PERNAH dinormalisasi, diperbaiki, atau diubah di sini.
// Hanya "\r" di ujung baris dan BOM file yang dibuang (artefak berkas, bukan isi teks).
import { createHash } from 'node:crypto'

export const EXPECTED = { surahs: 114, ayahs: 6236, juz: 30, pages: 604 }
export const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex')

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
const LATIN_RE = /[A-Za-z]/

/** Format Tanzil: "sura|aya|teks"; baris kosong dan komentar "#" diabaikan. */
export function parseVerseFile(content, label) {
  const rows = []
  content
    .replace(/^\uFEFF/, '')
    .split('\n')
    .forEach((raw, i) => {
      const line = raw.replace(/\r$/, '')
      if (line === '' || line.startsWith('#')) return
      const m = /^(\d+)\|(\d+)\|(.*)$/.exec(line)
      if (!m) throw new Error(`${label}: baris ${i + 1} tidak sesuai format "sura|aya|teks"`)
      rows.push({ surah: Number(m[1]), ayah: Number(m[2]), text: m[3] })
    })
  return rows
}

const decodeEntities = (s) =>
  s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')

const attrs = (tag) => {
  const o = {}
  for (const m of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) o[m[1]] = decodeEntities(m[2])
  return o
}
const collect = (xml, name) => [...xml.matchAll(new RegExp(`<${name}\\s([^>]*?)/?>`, 'g'))].map((m) => attrs(m[1]))

/** quran-data.xml (Tanzil Quran Metadata): <sura>, <juz>, <page>. Gagal keras bila skema tidak sesuai. */
export function parseMetadata(xml) {
  const need = (rows, name, keys) => {
    if (rows.length === 0) throw new Error(`Metadata: elemen <${name}> tidak ditemukan`)
    for (const k of keys) if (!(k in rows[0])) throw new Error(`Metadata: atribut "${k}" tidak ada pada <${name}>`)
  }
  const suras = collect(xml, 'sura')
  const juzs = collect(xml, 'juz')
  const pages = collect(xml, 'page')
  need(suras, 'sura', ['index', 'ayas', 'name', 'tname', 'ename', 'type', 'order'])
  need(juzs, 'juz', ['index', 'sura', 'aya'])
  need(pages, 'page', ['index', 'sura', 'aya'])
  const typeMap = { Meccan: 'Makkiyah', Medinan: 'Madaniyah' }
  return {
    suras: suras.map((a) => ({
      index: Number(a.index), ayas: Number(a.ayas), name: a.name, tname: a.tname, ename: a.ename,
      rawType: a.type, type: typeMap[a.type] ?? null, order: Number(a.order),
    })),
    juz: juzs.map((a) => ({ index: Number(a.index), sura: Number(a.sura), aya: Number(a.aya) })),
    pages: pages.map((a) => ({ index: Number(a.index), sura: Number(a.sura), aya: Number(a.aya) })),
  }
}

/** Mengembalikan { errors, warnings, stats }. Dataset hanya boleh diimpor bila errors kosong. */
export function validateDataset({ ayahs, meta, expectedCounts, translation }) {
  const errors = []
  const warnings = []
  const err = (m) => errors.push(m)

  // --- metadata surah ---
  if (meta.suras.length !== EXPECTED.surahs) err(`Metadata: ${meta.suras.length} surah (seharusnya ${EXPECTED.surahs})`)
  meta.suras.forEach((s, i) => {
    if (s.index !== i + 1) err(`Metadata: urutan surah salah di posisi ${i + 1} (index=${s.index})`)
    if (!s.name || !s.tname) err(`Metadata: nama surah ${s.index} kosong`)
    if (!s.type) err(`Metadata: tipe tempat turun surah ${s.index} tidak dikenal ("${s.rawType}")`)
  })

  // --- teks Arab ---
  const seen = new Set()
  const perSurah = new Map()
  let prev = null
  ayahs.forEach((r, i) => {
    const key = `${r.surah}:${r.ayah}`
    if (!Number.isInteger(r.surah) || r.surah < 1 || r.surah > EXPECTED.surahs) err(`Teks: referensi surah tidak valid (${key})`)
    if (!Number.isInteger(r.ayah) || r.ayah < 1) err(`Teks: nomor ayat tidak valid (${key})`)
    if (seen.has(key)) err(`Teks: duplikat ${key}`)
    seen.add(key)
    if (prev && (r.surah < prev.surah || (r.surah === prev.surah && r.ayah <= prev.ayah))) err(`Teks: urutan salah pada baris data ${i + 1} (${prev.surah}:${prev.ayah} lalu ${key})`)
    prev = r
    if (r.text.trim() === '') err(`Teks: teks Arab kosong pada ${key}`)
    else {
      if (LATIN_RE.test(r.text)) err(`Teks: huruf Latin pada teks Arab ${key} (bukan data Al-Qur'an yang sah)`)
      if (!ARABIC_RE.test(r.text)) err(`Teks: tidak ada karakter Arab pada ${key}`)
    }
    perSurah.set(r.surah, [...(perSurah.get(r.surah) ?? []), r.ayah])
  })

  if (ayahs.length !== EXPECTED.ayahs) err(`Teks: ${ayahs.length} ayat (seharusnya ${EXPECTED.ayahs} pada konvensi Hafs/Kufi)`)

  for (let s = 1; s <= EXPECTED.surahs; s++) {
    const nums = perSurah.get(s)
    if (!nums) { err(`Teks: surah ${s} tidak ada`); continue }
    const metaCount = meta.suras[s - 1]?.ayas
    const tableCount = expectedCounts[s - 1]
    if (nums.length !== metaCount) err(`Surah ${s}: teks ${nums.length} ayat, metadata Tanzil ${metaCount}`)
    if (nums.length !== tableCount) err(`Surah ${s}: teks ${nums.length} ayat, tabel acuan ${tableCount} (periksa manual; tabel acuan belum terverifikasi independen)`)
    nums.forEach((n, i) => { if (n !== i + 1) { err(`Surah ${s}: penomoran ayat tidak berurutan/ada yang hilang (posisi ${i + 1} berisi ${n})`) } })
  }

  // --- bismillah tidak boleh menempel di ayat 1 surah lain (tampil terpisah di UI) ---
  const bism = ayahs.find((r) => r.surah === 1 && r.ayah === 1)?.text
  if (bism) {
    for (const r of ayahs) {
      if (r.ayah === 1 && r.surah !== 1 && r.text.startsWith(bism) && r.text.length > bism.length) {
        err(`Teks: ayat ${r.surah}:1 diawali basmalah; UI akan menampilkannya dua kali (periksa pilihan berkas)`)
      }
    }
  }

  // --- referensi juz dan halaman ---
  const ordinal = new Map(ayahs.map((r, i) => [`${r.surah}:${r.ayah}`, i + 1]))
  const checkStarts = (list, name, expectedCount) => {
    if (list.length !== expectedCount) err(`${name}: ${list.length} entri (seharusnya ${expectedCount})`)
    let last = 0
    list.forEach((e, i) => {
      if (e.index !== i + 1) err(`${name}: index ${e.index} di posisi ${i + 1}`)
      const o = ordinal.get(`${e.sura}:${e.aya}`)
      if (!o) { err(`${name} ${e.index}: referensi ${e.sura}:${e.aya} tidak ada pada teks`); return }
      if (o <= last) err(`${name} ${e.index}: posisi tidak naik (${e.sura}:${e.aya})`)
      last = o
    })
    if (list[0] && ordinal.get(`${list[0].sura}:${list[0].aya}`) !== 1) err(`${name} 1 tidak dimulai pada 1:1`)
  }
  checkStarts(meta.juz, 'Juz', EXPECTED.juz)
  checkStarts(meta.pages, 'Halaman', EXPECTED.pages)

  // --- terjemahan (opsional) ---
  let translationStats = null
  if (translation) {
    const tseen = new Set()
    translation.forEach((r) => {
      const key = `${r.surah}:${r.ayah}`
      if (tseen.has(key)) err(`Terjemahan: duplikat ${key}`)
      tseen.add(key)
      if (!ordinal.has(key)) err(`Terjemahan: ${key} tidak ada pada teks Arab`)
      if (r.text.trim() === '') err(`Terjemahan: kosong pada ${key}`)
    })
    for (const key of ordinal.keys()) if (!tseen.has(key)) err(`Terjemahan: ${key} tidak ada`)
    translationStats = { total: translation.length }
  }

  return {
    errors,
    warnings,
    stats: { surahs: perSurah.size, ayahs: ayahs.length, juz: meta.juz.length, pages: meta.pages.length, translation: translationStats },
  }
}

/** Menyusun baris siap-impor. Hanya dipanggil setelah validateDataset tanpa error. */
export function buildRecords({ ayahs, meta, translation, translationInfo }) {
  const ord = new Map(ayahs.map((r, i) => [`${r.surah}:${r.ayah}`, i + 1]))
  const assign = (starts) => {
    const startOrd = starts.map((s) => ord.get(`${s.sura}:${s.aya}`))
    return (o) => { let n = 0; while (n < startOrd.length && startOrd[n] <= o) n++; return n }
  }
  const juzOf = assign(meta.juz)
  const pageOf = assign(meta.pages)
  const idOf = new Map()
  const ayahRows = ayahs.map((r, i) => {
    const id = i + 1
    idOf.set(`${r.surah}:${r.ayah}`, id)
    return { id, surah_id: r.surah, ayah_number: r.ayah, arabic_text: r.text, juz_number: juzOf(id), page_number: pageOf(id) }
  })
  return {
    surahRows: meta.suras.map((s) => ({
      id: s.index, name_arabic: s.name, name_latin: s.tname, meaning_english: s.ename || null,
      meaning_indonesian: null, total_ayah: s.ayas, revelation_type: s.type, revelation_order: s.order,
    })),
    ayahRows,
    juzRows: meta.juz.map((j) => ({ juz_number: j.index, start_surah_id: j.sura, start_ayah_number: j.aya })),
    translationRows: translation
      ? translation.map((t) => ({
          ayah_id: idOf.get(`${t.surah}:${t.ayah}`), language_code: translationInfo.language,
          translator_name: translationInfo.translator, translation_text: t.text, source_reference: translationInfo.source,
        }))
      : [],
  }
}
