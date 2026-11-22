import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CloudOff, X } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/hooks/useBookmarks'
import { readJSON, writeJSON } from '@/lib/storage/localStore'

const KEY = 'lanila-tilawah-guest-notice-dismissed'

/** Menjelaskan bahwa penanda guest hanya tersimpan di perangkat ini. Tidak memaksa login. */
export function GuestBookmarkNotice({ always = false }: { always?: boolean }) {
  const { user, loading } = useAuth()
  const { items } = useBookmarks()
  const { pathname, search } = useLocation()
  const [dismissed, setDismissed] = useState(() => readJSON<boolean>(KEY, false))

  if (loading || user) return null
  if (!always && (dismissed || items.length === 0)) return null

  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
      <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-muted-strong" aria-hidden />
      <p className="type-caption flex-1 text-sm">
        Penanda dan posisi baca disimpan <strong>di perangkat ini saja</strong>, tidak tersinkron.{' '}
        <Link to="/login" state={{ from: pathname + search }} className="font-semibold text-brand underline">
          Masuk
        </Link>{' '}
        agar tersimpan di akunmu dan muncul di semua perangkat.
      </p>
      {!always && (
        <IconButton
          icon={X}
          label="Tutup pemberitahuan"
          className="-m-2"
          onClick={() => {
            setDismissed(true)
            writeJSON(KEY, true)
          }}
        />
      )}
    </div>
  )
}
