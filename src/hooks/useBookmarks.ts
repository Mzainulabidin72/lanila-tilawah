import { useContext } from 'react'
import { BookmarksContext, type BookmarksValue } from '@/contexts/BookmarksContext'

export function useBookmarks(): BookmarksValue {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error('useBookmarks harus dipakai di dalam <BookmarksProvider>.')
  return ctx
}
