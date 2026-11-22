import { Bookmark, BookmarkMinus, Copy, Languages, NotebookPen, Share2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/hooks/useToast'
import { copyText, shareText } from '@/lib/utils/clipboard'
import { composeVerse, verseReference } from '@/lib/utils/verseText'
import type { QuranSurah, QuranVerse } from '@/types/quran'

interface Props {
  verse: QuranVerse | null
  surah: QuranSurah
  bookmarked: boolean
  /** true pada mode placeholder: salin/bagikan dinonaktifkan agar teks palsu tidak tersebar */
  copyDisabled: boolean
  onClose: () => void
  onToggleBookmark: (ayah: number) => void
  onEditNote: (ayah: number) => void
}

const ROW = 'flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-50'

function Row({ icon, children, ...rest }: { icon: ReactNode; children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className={ROW} {...rest}>
      <span className="text-muted-strong" aria-hidden>
        {icon}
      </span>
      {children}
    </button>
  )
}

export function VerseActionsSheet({ verse, surah, bookmarked, copyDisabled, onClose, onToggleBookmark, onEditNote }: Props) {
  const toast = useToast()
  const ref = verse ? verseReference(surah.name_latin, surah.id, verse.ayah_number) : ''

  const copy = async (text: string, okMsg: string) => {
    if (await copyText(text)) toast.success(okMsg)
    else toast.error('Tidak dapat menyalin. Izinkan akses clipboard di browser.')
    onClose()
  }

  const share = async () => {
    if (!verse) return
    const url = `${window.location.origin}/quran/${surah.id}?ayah=${verse.ayah_number}`
    const r = await shareText(composeVerse({ arabic: verse.arabic_text, translation: verse.translation, ref }), ref, url)
    if (r === 'copied') toast.success('Tautan dan teks ayat disalin.')
    else if (r === 'failed') toast.error('Tidak dapat membagikan ayat ini.')
    if (r !== 'cancelled') onClose()
  }

  return (
    <BottomSheet open={verse !== null} onClose={onClose} title={ref || 'Ayat'} description={verse ? `Juz ${verse.juz_number}${verse.page_number ? ` · Halaman ${verse.page_number}` : ''}` : undefined}>
      {verse && (
        <div className="space-y-1 pb-2">
          {copyDisabled && <Badge tone="gold" className="mb-2">Placeholder: salin dan bagikan dinonaktifkan</Badge>}
          <Row icon={<Copy className="h-5 w-5" />} disabled={copyDisabled} onClick={() => void copy(composeVerse({ arabic: verse.arabic_text, ref }), 'Ayat disalin.')}>
            Salin ayat (Arab)
          </Row>
          <Row icon={<Languages className="h-5 w-5" />} disabled={copyDisabled || !verse.translation} onClick={() => void copy(composeVerse({ translation: verse.translation, ref }), 'Terjemahan disalin.')}>
            Salin terjemahan
          </Row>
          <Row icon={<Share2 className="h-5 w-5" />} disabled={copyDisabled} onClick={() => void share()}>
            Bagikan ayat
          </Row>
          <Row
            icon={bookmarked ? <BookmarkMinus className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            onClick={() => {
              onToggleBookmark(verse.ayah_number)
              onClose()
            }}
          >
            {bookmarked ? 'Hapus penanda' : 'Tandai ayat'}
          </Row>
          {bookmarked && (
            <Row
              icon={<NotebookPen className="h-5 w-5" />}
              onClick={() => {
                onClose()
                onEditNote(verse.ayah_number)
              }}
            >
              Tambah / ubah catatan
            </Row>
          )}
        </div>
      )}
    </BottomSheet>
  )
}
