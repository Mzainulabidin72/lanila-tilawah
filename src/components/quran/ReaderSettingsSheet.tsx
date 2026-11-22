import { Minus, Plus } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { IconButton } from '@/components/ui/IconButton'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useReaderPrefs } from '@/hooks/useReaderPrefs'
import { ARABIC_SIZES_REM, TRANSLATION_SIZES_REM } from '@/contexts/ReaderPrefsContext'

function SizeRow({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="type-label">{label}</p>
        <p className="type-caption" aria-live="polite">
          Ukuran {value} dari {max}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <IconButton icon={Minus} label={`Perkecil ${label.toLowerCase()}`} variant="soft" disabled={value <= 1} onClick={() => onChange(value - 1)} />
        <IconButton icon={Plus} label={`Perbesar ${label.toLowerCase()}`} variant="soft" disabled={value >= max} onClick={() => onChange(value + 1)} />
      </div>
    </div>
  )
}

export function ReaderSettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { prefs, setPrefs, reset } = useReaderPrefs()
  return (
    <BottomSheet open={open} onClose={onClose} title="Tampilan membaca" description="Tersimpan di perangkat ini.">
      <div className="divide-y divide-line">
        <SizeRow label="Teks Arab" value={prefs.arabicSize} max={ARABIC_SIZES_REM.length} onChange={(n) => setPrefs({ arabicSize: n })} />
        <SizeRow label="Terjemahan" value={prefs.translationSize} max={TRANSLATION_SIZES_REM.length} onChange={(n) => setPrefs({ translationSize: n })} />
        <div className="flex items-center justify-between gap-3 py-3">
          <p className="type-label">Tampilkan terjemahan</p>
          <Switch checked={prefs.showTranslation} onChange={(v) => setPrefs({ showTranslation: v })} label="Tampilkan terjemahan" />
        </div>
        <div className="space-y-2 py-3">
          <p className="type-label">Tema</p>
          <ThemeToggle variant="segmented" />
        </div>
      </div>
      <Button variant="ghost" className="mt-2" onClick={reset}>
        Kembalikan ke bawaan
      </Button>
    </BottomSheet>
  )
}
