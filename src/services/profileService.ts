import { supabase } from '@/lib/supabase/client'
import { toAppError } from '@/lib/utils/errors'
import type { Profile, UserPreferences } from '@/types'

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) throw toAppError(error)
    return data as Profile | null
  },

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw toAppError(error)
    return data as UserPreferences | null
  },

  /** Hanya kolom full_name yang boleh diubah (dibatasi grant + RLS di database). */
  async updateFullName(userId: string, fullName: string): Promise<void> {
    const { error } = await supabase.from('profiles').update({ full_name: fullName.trim() }).eq('id', userId)
    if (error) throw toAppError(error)
  },

  async updateTheme(userId: string, theme: 'light' | 'dark'): Promise<void> {
    const { error } = await supabase.from('user_preferences').update({ theme }).eq('user_id', userId)
    if (error) throw toAppError(error)
  },
}
