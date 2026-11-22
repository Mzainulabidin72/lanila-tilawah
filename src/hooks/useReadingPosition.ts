import { useContext } from 'react'
import { ReadingPositionContext, type ReadingPositionValue } from '@/contexts/ReadingPositionContext'

export function useReadingPosition(): ReadingPositionValue {
  const ctx = useContext(ReadingPositionContext)
  if (!ctx) throw new Error('useReadingPosition harus dipakai di dalam <ReadingPositionProvider>.')
  return ctx
}
