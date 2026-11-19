import { useContext } from 'react'
import { ComingSoonContext, type ComingSoonFn } from '@/contexts/ComingSoonContext'

export function useComingSoon(): ComingSoonFn {
  const ctx = useContext(ComingSoonContext)
  if (!ctx) throw new Error('useComingSoon harus dipakai di dalam <ComingSoonProvider>.')
  return ctx
}
