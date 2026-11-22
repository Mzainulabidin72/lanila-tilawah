import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { bookmarkService } from '@/services/bookmarkService'
import { PLACEHOLDER_MODE } from '@/services/quranService'
import { readJSON, writeJSON, removeKey } from '@/lib/storage/localStore'
import { toAppError } from '@/lib/utils/errors'
import type { BookmarkItem } from '@/types/quran'

const GUEST_KEY = 'lanila-tilawah-bookmarks-guest'
const keyOf = (s: number, a: number) => `${s}:${a}`

export interface BookmarksValue {
  items: BookmarkItem[]
  /** kunci "surah:ayat" untuk pencarian cepat */
  keys: ReadonlySet<string>
  /** local = tersimpan di perangkat ini saja; cloud = tersinkron ke akun */
  mode: 'local' | 'cloud'
  status: 'loading' | 'ready' | 'error'
  error: string | null
  toggle: (surahId: number, ayahNumber: number) => Promise<void>
  remove: (surahId: number, ayahNumber: number) => Promise<void>
  updateNote: (surahId: number, ayahNumber: number, note: string | null) => Promise<void>
  reload: () => void
}
export const BookmarksContext = createContext<BookmarksValue | null>(null)

const sortNewest = (a: BookmarkItem[]) => [...a].sort((x, y) => y.createdAt.localeCompare(x.createdAt))

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const toast = useToast()
  const userId = user?.id ?? null
  const cloud = !!userId && !PLACEHOLDER_MODE

  const [items, setItems] = useState<BookmarkItem[]>([])
  const [status, setStatus] = useState<BookmarksValue['status']>('loading')
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(() => {
    if (authLoading) return
    let active = true

    if (!cloud) {
      setItems(sortNewest(readJSON<BookmarkItem[]>(GUEST_KEY, [])))
      setStatus('ready')
      setError(null)
      return
    }

    setStatus('loading')
    ;(async () => {
      try {
        // Gabungkan penanda guest ke akun (aman dari duplikat), lalu bersihkan penyimpanan lokal.
        const guest = readJSON<BookmarkItem[]>(GUEST_KEY, [])
        if (guest.length > 0 && userId) {
          await bookmarkService.bulkAdd(userId, guest)
          removeKey(GUEST_KEY)
          if (active) toast.success(`${guest.length} penanda dari perangkat ini digabungkan ke akunmu.`)
        }
        const list = await bookmarkService.list()
        if (!active) return
        setItems(list)
        setError(null)
        setStatus('ready')
      } catch (e) {
        if (!active) return
        // penanda lokal tetap aman di perangkat; akan dicoba digabung lagi pada muat berikutnya
        setError(toAppError(e).message)
        setStatus('error')
      }
    })()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, cloud, userId, nonce])

  const keys = useMemo(() => new Set(items.map((i) => keyOf(i.surahId, i.ayahNumber))), [items])

  const commitLocal = (next: BookmarkItem[]) => {
    const sorted = sortNewest(next)
    setItems(sorted)
    writeJSON(GUEST_KEY, sorted)
  }

  const find = (s: number, a: number) => itemsRef.current.find((i) => i.surahId === s && i.ayahNumber === a)

  const remove = useCallback(
    async (surahId: number, ayahNumber: number) => {
      const target = find(surahId, ayahNumber)
      if (!target) return
      if (!cloud) return commitLocal(itemsRef.current.filter((i) => i !== target))
      const before = itemsRef.current
      setItems(before.filter((i) => i !== target)) // optimistis
      try {
        if (target.id) await bookmarkService.remove(target.id)
      } catch (e) {
        setItems(before)
        toast.error(toAppError(e).message)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cloud, toast],
  )

  const toggle = useCallback(
    async (surahId: number, ayahNumber: number) => {
      if (find(surahId, ayahNumber)) return remove(surahId, ayahNumber)
      const draft: BookmarkItem = { id: null, surahId, ayahNumber, note: null, createdAt: new Date().toISOString() }
      if (!cloud || !userId) return commitLocal([...itemsRef.current, draft]) // cegah duplikat: find() di atas

      const before = itemsRef.current
      setItems(sortNewest([...before, draft])) // optimistis
      try {
        const saved = await bookmarkService.add(userId, surahId, ayahNumber)
        setItems((cur) => sortNewest(cur.map((i) => (i === draft ? saved : i))))
      } catch (e) {
        setItems(before)
        toast.error(toAppError(e).message)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cloud, userId, remove, toast],
  )

  const updateNote = useCallback(
    async (surahId: number, ayahNumber: number, note: string | null) => {
      const target = find(surahId, ayahNumber)
      if (!target) return
      const clean = note && note.trim() ? note.trim().slice(0, 500) : null
      const updated = { ...target, note: clean }
      if (!cloud) return commitLocal(itemsRef.current.map((i) => (i === target ? updated : i)))
      const before = itemsRef.current
      setItems(before.map((i) => (i === target ? updated : i)))
      try {
        if (target.id) await bookmarkService.updateNote(target.id, clean)
      } catch (e) {
        setItems(before)
        toast.error(toAppError(e).message)
        throw e
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cloud, toast],
  )

  const value = useMemo<BookmarksValue>(
    () => ({ items, keys, mode: cloud ? 'cloud' : 'local', status, error, toggle, remove, updateNote, reload: () => setNonce((n) => n + 1) }),
    [items, keys, cloud, status, error, toggle, remove, updateNote],
  )
  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>
}
