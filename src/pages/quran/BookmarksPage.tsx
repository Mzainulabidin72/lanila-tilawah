import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookMarked, NotebookPen, SearchX, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button, buttonStyles } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Badge } from '@/components/ui/Badge'
import { GuestBookmarkNotice } from '@/components/quran/GuestBookmarkNotice'
import { BookmarkNoteDialog } from '@/components/quran/BookmarkNoteDialog'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useAsync } from '@/hooks/useAsync'
import { quranService } from '@/services/quranService'
import { verseReference } from '@/lib/utils/verseText'

export function BookmarksPage() {
  const { items, status, error, mode, remove, updateNote, reload } = useBookmarks()
  const surahs = useAsync(() => quranService.getSurahs(), [])
  const [editing, setEditing] = useState<{ surahId: number; ayahNumber: number } | null>(null)

  const nameOf = (id: number) => surahs.data?.find((s) => s.id === id)?.name_latin ?? `Surah ${id}`
  const editingItem = editing ? items.find((i) => i.surahId === editing.surahId && i.ayahNumber === editing.ayahNumber) : undefined

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Penanda"
        description={mode === 'cloud' ? 'Tersimpan di akunmu dan tersinkron antar perangkat.' : 'Tersimpan di perangkat ini.'}
        action={<Badge tone={mode === 'cloud' ? 'brand' : 'neutral'}>{mode === 'cloud' ? 'Tersinkron' : 'Hanya perangkat ini'}</Badge>}
      />
      <GuestBookmarkNotice always />

      {status === 'loading' ? (
        <LoadingState label="Memuat penanda…" />
      ) : status === 'error' ? (
        <Card>
          <EmptyState icon={SearchX} title="Gagal memuat penanda" description={error ?? 'Coba lagi.'} action={<Button onClick={reload}>Coba lagi</Button>} />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={BookMarked}
            title="Belum ada penanda"
            description="Ketuk ikon penanda pada sebuah ayat untuk menyimpannya di sini."
            action={<Link to="/quran" className={buttonStyles('primary')}>Mulai membaca</Link>}
          />
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((b) => {
            const ref = verseReference(nameOf(b.surahId), b.surahId, b.ayahNumber)
            return (
              <li key={`${b.surahId}:${b.ayahNumber}`}>
                <Card className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="type-card-title">{ref}</p>
                      <p className="type-caption">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(b.createdAt))}</p>
                    </div>
                    <div className="-mr-2 -mt-2 flex">
                      <IconButton icon={NotebookPen} label={`Catatan untuk ${ref}`} onClick={() => setEditing({ surahId: b.surahId, ayahNumber: b.ayahNumber })} />
                      <IconButton icon={Trash2} label={`Hapus penanda ${ref}`} onClick={() => void remove(b.surahId, b.ayahNumber)} />
                    </div>
                  </div>
                  {b.note && <p className="type-body whitespace-pre-wrap break-words">{b.note}</p>}
                  <Link to={`/quran/${b.surahId}?ayah=${b.ayahNumber}`} className={buttonStyles('secondary')}>
                    Buka ayat
                  </Link>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <BookmarkNoteDialog
        open={!!editingItem}
        onClose={() => setEditing(null)}
        reference={editing ? verseReference(nameOf(editing.surahId), editing.surahId, editing.ayahNumber) : ''}
        initialNote={editingItem?.note ?? null}
        onSave={(n) => updateNote(editing!.surahId, editing!.ayahNumber, n)}
      />
    </div>
  )
}
