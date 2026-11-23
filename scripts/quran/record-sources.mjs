#!/usr/bin/env node
// Menghitung SHA-256 semua berkas asli di data/quran-source/original dan menulis MANIFEST.json.
// Jalankan setelah mengunduh. Tidak mengubah berkas asli.
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const root = 'data/quran-source/original'
if (!existsSync(root)) { console.error('Folder tidak ada:', root); process.exit(2) }
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
const files = walk(root).filter((f) => !f.endsWith('MANIFEST.json') && !f.endsWith('.gitkeep'))
const entries = files.sort().map((f) => ({ path: f.replace(/\\/g, '/'), bytes: statSync(f).size, sha256: createHash('sha256').update(readFileSync(f)).digest('hex') }))
writeFileSync(`${root}/MANIFEST.json`, JSON.stringify({ generatedAt: new Date().toISOString(), files: entries }, null, 2))
console.log(`✓ ${entries.length} berkas dicatat di ${root}/MANIFEST.json`)
entries.slice(0, 12).forEach((e) => console.log(`  ${e.sha256.slice(0, 16)}…  ${e.path}`))
