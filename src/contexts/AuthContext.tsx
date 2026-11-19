import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { authService } from '@/services/authService'
import { profileService } from '@/services/profileService'
import type { Profile } from '@/types'

export interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  /** true selama sesi awal belum selesai diverifikasi */
  loading: boolean
  /** true bila pengguna datang dari tautan reset password */
  isRecovery: boolean
  displayName: string
  signOut: () => Promise<void>
  /** Muat ulang profil dari database (mis. setelah mengubah nama). */
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)

  // Pemulihan sesi saat startup + listener perubahan auth.
  useEffect(() => {
    let active = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session)
      })
      .catch(() => {
        if (active) setSession(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    // Callback dibuat sinkron: memanggil Supabase di dalamnya dapat menyebabkan deadlock.
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active) return
      setSession(next)
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true)
      if (event === 'SIGNED_OUT') {
        setIsRecovery(false)
        setProfile(null)
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Muat profil terpisah dari listener, bergantung pada id user saja.
  const userId = session?.user.id
  useEffect(() => {
    if (!userId) return
    let active = true
    profileService
      .getProfile(userId)
      .then((p) => {
        if (active) setProfile(p)
      })
      .catch(() => {
        if (active) setProfile(null) // fallback ke metadata user
      })
    return () => {
      active = false
    }
  }, [userId])

  const refreshProfile = useCallback(async () => {
    if (!userId) return
    setProfile(await profileService.getProfile(userId))
  }, [userId])

  const signOut = useCallback(async () => {
    try {
      await authService.signOut()
    } finally {
      setSession(null)
      setProfile(null)
      setIsRecovery(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null
    const metaName = (user?.user_metadata?.full_name as string | undefined) ?? ''
    const displayName = profile?.full_name || metaName || user?.email?.split('@')[0] || 'Pengguna'
    return { session, user, profile, loading, isRecovery, displayName, signOut, refreshProfile }
  }, [session, profile, loading, isRecovery, signOut, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
