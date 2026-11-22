import { supabase } from '@/lib/supabase/client'
import { toAppError } from '@/lib/utils/errors'
import type { BookmarkItem } from '@/types/quran'

interface Row {
  id: string
  surah_id: number
  ayah_number: number
  note: string | null
  created_at: string
}
const toItem = (r: Row): BookmarkItem => ({ id: r.id, surahId: r.surah_id, ayahNumber: r.ayah_number, note: r.note, createdAt: r.created_at })
const COLS = 'id, surah_id, ayah_number, note, created_at'

export const bookmarkService = {
  async list(): Promise<BookmarkItem[]> {
    const { data, error } = await supabase.from('bookmarks').select(COLS).order('created_at', { ascending: false })
    if (error) throw toAppError(error)
    return ((data ?? []) as Row[]).map(toItem)
  },

  async add(userId: string, surahId: number, ayahNumber: number, note: string | null = null): Promise<BookmarkItem> {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: userId, surah_id: surahId, ayah_number: ayahNumber, note })
      .select(COLS)
      .single()
    if (error) throw toAppError(error)
    return toItem(data as Row)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) throw toAppError(error)
  },

  async updateNote(id: string, note: string | null): Promise<void> {
    const { error } = await supabase.from('bookmarks').update({ note }).eq('id', id)
    if (error) throw toAppError(error)
  },

  /** Gabungkan penanda lokal ke akun. Duplikat dilewati (ON CONFLICT DO NOTHING); catatan server tidak ditimpa. */
  async bulkAdd(userId: string, items: Array<Pick<BookmarkItem, 'surahId' | 'ayahNumber' | 'note'>>): Promise<void> {
    if (items.length === 0) return
    const { error } = await supabase.from('bookmarks').upsert(
      items.map((i) => ({ user_id: userId, surah_id: i.surahId, ayah_number: i.ayahNumber, note: i.note })),
      { onConflict: 'user_id,surah_id,ayah_number', ignoreDuplicates: true },
    )
    if (error) throw toAppError(error)
  },
}
