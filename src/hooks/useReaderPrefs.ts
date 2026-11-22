import { useContext } from 'react'
import { ReaderPrefsContext, type ReaderPrefsValue } from '@/contexts/ReaderPrefsContext'

export function useReaderPrefs(): ReaderPrefsValue {
  const ctx = useContext(ReaderPrefsContext)
  if (!ctx) throw new Error('useReaderPrefs harus dipakai di dalam <ReaderPrefsProvider>.')
  return ctx
}
