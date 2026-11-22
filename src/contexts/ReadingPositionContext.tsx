import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { readingPositionService } from '@/services/readingPositionService'
import { PLACEHOLDER_MODE } from '@/services/quranService'
import { readJSON, writeJSON } from '@/lib/storage/localStore'
import type { ReadingPosition } from '@/types/quran'

const KEY = 'lanila-tilawah-position'
const DEBOUNCE_MS = 1500

export interface ReadingPositionValue {
  position: ReadingPosition | null
  /** Catat posisi baca. Lokal langsung; ke server dengan debounce. */
  savePosition: (surahId: number, ayahNumber: number) => void
  syncState: 'local' | 'synced' | 'pending' | 'error'
}
export const ReadingPositionContext = createContext<ReadingPositionValue | null>(null)

/**
 * Aturan rekonsiliasi (dipakai saat login):
 *  1. Posisi lokal milik user LAIN (ownerId berbeda) diabaikan, diganti data server.
 *  2. Selain itu, yang readAt-nya lebih baru menang. Seri => server.
 *  3. Server juga menolak tulis yang lebih lama (fungsi save_reading_position), jadi data basi tidak menimpa.
 */
export function ReadingPositionProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null
  const remote = !!userId && !PLACEHOLDER_MODE

  const [position, setPosition] = useState<ReadingPosition | null>(() => readJSON<ReadingPosition | null>(KEY, null))
  const [syncState, setSyncState] = useState<ReadingPositionValue['syncState']>('local')
  const pending = useRef<ReadingPosition | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const remoteRef = useRef(remote)
  remoteRef.current = remote
  const userIdRef = useRef(userId)
  userIdRef.current = userId

  const flush = useCallback(async () => {
    const p = pending.current
    if (!p || !remoteRef.current) return
    try {
      const applied = await readingPositionService.save(p.surahId, p.ayahNumber, p.readAt)
      if (pending.current === p) pending.current = null
      setSyncState('synced')
      // server menolak karena ada yang lebih baru dari perangkat lain: ikuti server
      if (applied && applied.readAt > p.readAt) {
        const next = { surahId: applied.surahId, ayahNumber: applied.ayahNumber, readAt: applied.readAt, ownerId: p.ownerId }
        setPosition(next)
        writeJSON(KEY, next)
      }
    } catch {
      setSyncState('error') // tetap di `pending`; dicoba lagi saat online/tersembunyi/simpan berikutnya
    }
  }, [])

  // Rekonsiliasi saat login.
  useEffect(() => {
    if (authLoading || !remote || !userId) {
      if (!authLoading) setSyncState('local')
      return
    }
    let active = true
    ;(async () => {
      try {
        const server = await readingPositionService.get()
        if (!active) return
        const local = readJSON<ReadingPosition | null>(KEY, null)
        const localUsable = local && (local.ownerId === null || local.ownerId === userId)

        if (server && (!localUsable || server.readAt >= local.readAt)) {
          const next = { ...server, ownerId: userId }
          setPosition(next)
          writeJSON(KEY, next)
        } else if (localUsable) {
          const next = { ...local, ownerId: userId }
          setPosition(next)
          writeJSON(KEY, next)
          pending.current = next
          await flush()
        } else if (!server && local && !localUsable) {
          setPosition(null) // milik user lain, jangan bocor ke akun ini
        }
        if (active) setSyncState((s) => (s === 'error' ? s : 'synced'))
      } catch {
        if (active) setSyncState('error')
      }
    })()
    return () => {
      active = false
    }
  }, [authLoading, remote, userId, flush])

  const savePosition = useCallback(
    (surahId: number, ayahNumber: number) => {
      const next: ReadingPosition = { surahId, ayahNumber, readAt: new Date().toISOString(), ownerId: userIdRef.current }
      setPosition((cur) => (cur && cur.surahId === surahId && cur.ayahNumber === ayahNumber ? cur : next))
      writeJSON(KEY, next)
      if (!remoteRef.current) return
      pending.current = next
      setSyncState('pending')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => void flush(), DEBOUNCE_MS)
    },
    [flush],
  )

  // Coba lagi saat kembali online dan kirim sisa antrean saat tab disembunyikan.
  useEffect(() => {
    const retry = () => void flush()
    const onHidden = () => document.visibilityState === 'hidden' && void flush()
    window.addEventListener('online', retry)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      window.removeEventListener('online', retry)
      document.removeEventListener('visibilitychange', onHidden)
      window.clearTimeout(timer.current)
    }
  }, [flush])

  const value = useMemo(() => ({ position, savePosition, syncState }), [position, savePosition, syncState])
  return <ReadingPositionContext.Provider value={value}>{children}</ReadingPositionContext.Provider>
}
