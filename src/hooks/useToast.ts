import { useContext } from 'react'
import { ToastContext, type ToastApi } from '@/contexts/ToastContext'

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>.')
  return ctx
}
