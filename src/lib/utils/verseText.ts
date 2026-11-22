export const verseReference = (surahName: string, surahId: number, ayah: number) => `QS. ${surahName} ${surahId}:${ayah}`

/** Susunan teks untuk salin/bagikan. Isi ayat dan terjemahan dipakai apa adanya dari data. */
export function composeVerse(opts: { arabic?: string; translation?: string | null; ref: string }): string {
  const parts = [opts.arabic, opts.translation, `${opts.ref} · Lanila Tilawah (teks: Tanzil.net)`].filter((p): p is string => !!p)
  return parts.join('\n\n')
}
