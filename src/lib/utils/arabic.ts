/**
 * Normalisasi KHUSUS untuk pencarian (tidak pernah dipakai untuk menampilkan atau menyimpan teks):
 * membuang harakat dan tatwil, menyamakan bentuk alif.
 */
export function normalizeArabicForSearch(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .toLowerCase()
}

export function normalizeLatinForSearch(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}
