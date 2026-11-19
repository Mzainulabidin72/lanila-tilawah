import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useToast } from './useToast'

/** Satu-satunya jalur logout UI; memakai AuthContext dari Part 01. */
export function useLogout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  return useCallback(async () => {
    try {
      await signOut()
    } catch {
      toast.error('Gagal keluar dari server, tetapi sesi di perangkat ini sudah dihapus.')
    }
    navigate('/login', { replace: true })
  }, [signOut, navigate, toast])
}
