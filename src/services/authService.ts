import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { toAppError } from '@/lib/utils/errors'

export type SignUpResult = 'signed_in' | 'confirm_email' | 'already_registered'

export const authService = {
  async signUp(input: { fullName: string; email: string; password: string }): Promise<SignUpResult> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: { full_name: input.fullName.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    if (error) throw toAppError(error)

    // Saat konfirmasi email aktif, email yang sudah terdaftar dikembalikan
    // tanpa error, dengan identities kosong (mencegah enumerasi akun).
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return 'already_registered'
    }
    return data.session ? 'signed_in' : 'confirm_email'
  },

  async signIn(email: string, password: string): Promise<Session> {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw toAppError(error)
    return data.session
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    // Sesi lokal tetap dibersihkan oleh supabase-js walau request gagal.
    if (error && error.name !== 'AuthSessionMissingError') throw toAppError(error)
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw toAppError(error)
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw toAppError(error)
  },
}
