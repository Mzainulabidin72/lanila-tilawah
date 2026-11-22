export type RevelationType = 'Makkiyah' | 'Madaniyah'

export interface QuranSurah {
  id: number
  name_arabic: string
  name_latin: string
  meaning_english: string | null
  meaning_indonesian: string | null
  total_ayah: number
  revelation_type: RevelationType
  revelation_order: number | null
}

export interface QuranVerse {
  id: number
  ayah_number: number
  arabic_text: string
  juz_number: number
  page_number: number | null
  translation: string | null
}

export interface QuranJuz {
  juz_number: number
  start_surah_id: number
  start_ayah_number: number
}

export interface DatasetInfo {
  validated: boolean
  total_surah: number | null
  total_ayah: number | null
  numbering_convention: string | null
  text_source: string | null
  text_version: string | null
  text_license: string | null
  text_attribution: string | null
  translation_language: string | null
  translation_translator: string | null
  translation_license: string | null
  translation_attribution: string | null
}

export type QuranStatus =
  | { state: 'ready'; info: DatasetInfo; placeholder: boolean }
  | { state: 'unavailable'; reason: string }

export interface VerseSearchHit {
  surahId: number
  ayahNumber: number
  translation: string
}

export interface BookmarkItem {
  /** null untuk penanda lokal (guest) */
  id: string | null
  surahId: number
  ayahNumber: number
  note: string | null
  createdAt: string
}

export interface ReadingPosition {
  surahId: number
  ayahNumber: number
  /** ISO timestamp saat ayat dibaca */
  readAt: string
  /** pemilik data lokal: id user, atau null untuk guest */
  ownerId: string | null
}
