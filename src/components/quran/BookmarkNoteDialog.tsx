import { useState, type FormEvent } from 'react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { toAppError } from '@/lib/utils/errors'

interface Props {
  open: boolean
  onClose: () => void
  reference: string
  initialNote: string | null
  onSave: (note: string | null) => Promise<void>
}

export function BookmarkNoteDialog({ open, onClose, reference, initialNote, onSave }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Catatan penanda" description={reference}>
      <NoteForm initialNote={initialNote} onSave={onSave} onClose={onClose} />
    </BottomSheet>
  )
}

function NoteForm({ initialNote, onSave, onClose }: Pick<Props, 'initialNote' | 'onSave' | 'onClose'>) {
  const [note, setNote] = useState(initialNote ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(note.trim() ? note : null)
      onClose()
    } catch (err) {
      setError(toAppError(err).message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 pb-2">
      {error && <Alert kind="error">{error}</Alert>}
      <div className="space-y-1.5">
        <label htmlFor="bookmark-note" className="type-label block">
          Catatan pribadi (opsional)
        </label>
        <textarea
          id="bookmark-note"
          data-autofocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={4}
          className="w-full rounded-xl border border-line bg-surface p-3 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          placeholder="Mengapa ayat ini kamu tandai?"
        />
        <p className="type-caption text-right">{note.length}/500</p>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" loading={saving}>
          Simpan
        </Button>
      </div>
    </form>
  )
}
