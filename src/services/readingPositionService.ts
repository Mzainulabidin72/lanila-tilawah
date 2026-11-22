import { supabase } from '@/lib/supabase/client'
import { toAppError } from '@/lib/utils/errors'

export interface RemotePosition {
  surahId: number
  ayahNumber: number
  readAt: string
}
interface Row {
  surah_id: number
  ayah_number: number
  updated_at: string
}
const toPos = (r: Row): RemotePosition => ({ surahId: r.surah_id, ayahNumber: r.ayah_number, readAt: r.updated_at })

export const readingPositionService = {
  async get(): Promise<RemotePosition | null> {
    const { data, error } = await supabase.from('reading_positions').select('surah_id, ayah_number, updated_at').maybeSingle()
    if (error) throw toAppError(error)
    return data ? toPos(data as Row) : null
  },

  /** Server menolak data yang lebih lama dari yang tersimpan (lihat fungsi save_reading_position). Mengembalikan posisi yang berlaku. */
  async save(surahId: number, ayahNumber: number, readAt: string): Promise<RemotePosition | null> {
    const { data, error } = await supabase.rpc('save_reading_position', {
      p_surah_id: surahId, p_ayah_number: ayahNumber, p_read_at: readAt,
    })
    if (error) throw toAppError(error)
    const row = (Array.isArray(data) ? data[0] : data) as Row | null
    return row && row.surah_id ? toPos(row) : null
  },
}
