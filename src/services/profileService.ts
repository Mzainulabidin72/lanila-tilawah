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
}
