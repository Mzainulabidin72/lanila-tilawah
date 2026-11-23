import { supabase } from '@/lib/supabase/client'
import { AppError, toAppError } from '@/lib/utils/errors'
import { SURAHS } from '@/data/surahs'
import type { DatasetInfo, QuranJuz, QuranStatus, QuranSurah, QuranVerse, VerseSearchHit } from '@/types/quran'

/**
 * Mode placeholder: HANYA saat pengembangan (import.meta.env.DEV) dan flag eksplisit.
 * Isinya BUKAN Al-Qur'an; dipakai untuk menguji tampilan sebelum data tervalidasi diimpor.
 * Pada build produksi flag ini selalu false.
 */
export const PLACEHOLDER_MODE = import.meta.env.DEV && import.meta.env.VITE_QURAN_PLACEHOLDER === 'true'

const EXPECTED_SURAHS = 114
const EXPECTED_AYAHS = 6236
const EXPECTED_JUZ = 30

interface DbError {
  code?: string
}
const isMissingTable = (e: unknown) => ['PGRST205', '42P01'].includes((e as DbError)?.code ?? '')

// Cache promise di memori (data master statis). Dihapus saat gagal agar bisa dicoba ulang.
const cache = new Map<string, Promise<unknown>>()
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit) return hit as Promise<T>
  const p = load().catch((e) => {
    cache.delete(key)
    throw e
  })
  cache.set(key, p)
  return p
}

const incomplete = (what: string) => new AppError(`Data ${what} tidak lengkap. Tidak ditampilkan agar tidak menyesatkan.`, 'incomplete')

// ---------------- placeholder (DEV saja) ----------------
const PLACEHOLDER_INFO: DatasetInfo = {
  validated: false, total_surah: 114, total_ayah: 6236, numbering_convention: null,
  text_source: 'PLACEHOLDER', text_version: null, text_license: null, text_attribution: null,
  translation_language: null, translation_translator: null, translation_license: null, translation_attribution: null,
  translation_version: null, translation_source_url: null,
}
const placeholderSurahs = (): QuranSurah[] =>
  SURAHS.map((s, i) => ({
    id: s.number, name_arabic: '', name_latin: s.name, meaning_english: null, meaning_indonesian: null,
    total_ayah: s.verses, revelation_type: s.revelation, revelation_order: i + 1,
  }))

// ---------------- API ----------------
export const quranService = {
  async getStatus(): Promise<QuranStatus> {
    if (PLACEHOLDER_MODE) return { state: 'ready', info: PLACEHOLDER_INFO, placeholder: true }
    return cached('status', async () => {
      const { data, error } = await supabase.from('quran_dataset_info').select('*').eq('id', 1).maybeSingle()
      if (error) {
        if (isMissingTable(error)) return { state: 'unavailable', reason: 'Migrasi database Part 03 belum dijalankan.' } as QuranStatus
        throw toAppError(error)
      }
      const info = data as DatasetInfo | null
      if (!info || !info.validated) return { state: 'unavailable', reason: 'Dataset Al-Qur’an belum diimpor atau belum lolos validasi.' } as QuranStatus
      if (info.total_surah !== EXPECTED_SURAHS || info.total_ayah !== EXPECTED_AYAHS) {
        return { state: 'unavailable', reason: 'Ringkasan dataset tidak sesuai (bukan 114 surah / 6.236 ayat).' } as QuranStatus
      }
      return { state: 'ready', info, placeholder: false } as QuranStatus
    })
  },

  getSurahs(): Promise<QuranSurah[]> {
    if (PLACEHOLDER_MODE) return Promise.resolve(placeholderSurahs())
    return cached('surahs', async () => {
      const { data, error } = await supabase.from('quran_surahs').select('*').order('id')
      if (error) throw toAppError(error)
      const rows = (data ?? []) as QuranSurah[]
      if (rows.length !== EXPECTED_SURAHS) throw incomplete('surah')
      return rows
    })
  },

  async getSurahVerses(surahId: number): Promise<QuranVerse[]> {
    const surahs = await this.getSurahs()
    const surah = surahs.find((s) => s.id === surahId)
    if (!surah) throw new AppError('Surah tidak ditemukan.', 'not_found')

    if (PLACEHOLDER_MODE) {
      return Array.from({ length: surah.total_ayah }, (_, i) => ({
        id: i + 1, ayah_number: i + 1, juz_number: 1, page_number: null,
        arabic_text: `[PLACEHOLDER — bukan teks Al-Qur’an] ayat ${i + 1}`,
        translation: `[PLACEHOLDER — bukan terjemahan] ayat ${i + 1}`,
      }))
    }

    return cached(`verses:${surahId}`, async () => {
      const { data, error } = await supabase
        .from('quran_ayahs')
        .select('id, ayah_number, arabic_text, juz_number, page_number, quran_translations(translation_text, language_code)')
        .eq('surah_id', surahId)
        .eq('quran_translations.language_code', 'id')
        .order('ayah_number')
      if (error) throw toAppError(error)
      type Row = Omit<QuranVerse, 'translation'> & { quran_translations: Array<{ translation_text: string }> | null }
      const verses = ((data ?? []) as unknown as Row[]).map<QuranVerse>(({ quran_translations, ...v }) => ({
        ...v,
        translation: quran_translations?.[0]?.translation_text ?? null,
      }))
      // Jangan pernah menampilkan surah yang tidak lengkap atau penomorannya berlubang.
      if (verses.length !== surah.total_ayah || verses.some((v, i) => v.ayah_number !== i + 1)) throw incomplete(`surah ${surah.name_latin}`)
      return verses
    })
  },

  /** Teks basmalah diambil dari data (ayat 1:1), tidak pernah diketik manual. */
  async getBismillah(): Promise<string | null> {
    if (PLACEHOLDER_MODE) return '[PLACEHOLDER — basmalah]'
    return cached('bismillah', async () => {
      const { data, error } = await supabase.from('quran_ayahs').select('arabic_text').eq('surah_id', 1).eq('ayah_number', 1).maybeSingle()
      if (error) throw toAppError(error)
      return (data as { arabic_text: string } | null)?.arabic_text ?? null
    })
  },

  getJuz(): Promise<QuranJuz[]> {
    if (PLACEHOLDER_MODE) return Promise.resolve([])
    return cached('juz', async () => {
      const { data, error } = await supabase.from('quran_juz').select('*').order('juz_number')
      if (error) throw toAppError(error)
      const rows = (data ?? []) as QuranJuz[]
      if (rows.length !== EXPECTED_JUZ) throw incomplete('juz')
      return rows
    })
  },

  /** Pencarian pada terjemahan (bukan teks Arab). */
  async searchTranslations(query: string): Promise<VerseSearchHit[]> {
    if (PLACEHOLDER_MODE) return []
    const q = query.trim().replace(/[%_\\]/g, (c) => `\\${c}`)
    if (q.length < 3) return []
    const { data, error } = await supabase
      .from('quran_translations')
      .select('translation_text, quran_ayahs!inner(surah_id, ayah_number)')
      .eq('language_code', 'id')
      .ilike('translation_text', `%${q}%`)
      .order('ayah_id')
      .limit(20)
    if (error) throw toAppError(error)
    type Row = { translation_text: string; quran_ayahs: { surah_id: number; ayah_number: number } }
    return ((data ?? []) as unknown as Row[]).map((r) => ({
      surahId: r.quran_ayahs.surah_id, ayahNumber: r.quran_ayahs.ayah_number, translation: r.translation_text,
    }))
  },
}
