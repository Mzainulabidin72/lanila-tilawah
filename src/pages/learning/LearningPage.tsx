import { Link } from 'react-router-dom'
import { Brain, ChevronRight, Languages, Library, Mic, ScrollText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { useComingSoon } from '@/hooks/useComingSoon'

const TOPICS = [
  { title: 'Huruf Hijaiyah', text: 'Kenali huruf hijaiyah dan cara melafalkannya.', icon: Languages },
  { title: 'Tajwid', text: 'Pahami kaidah membaca agar bacaan lebih tepat.', icon: Mic },
  { title: 'Tafsir', text: 'Telusuri makna dan penjelasan ayat.', icon: ScrollText },
  { title: "Kosakata Al-Qur'an", text: 'Perbanyak kosakata yang sering muncul.', icon: Library },
]

export function LearningPage() {
  const soon = useComingSoon()

  return (
    <div className="space-y-6">
      <PageHeader title="Belajar" description="Pahami Al-Qur'an selangkah demi selangkah. Materi dikerjakan di fase berikutnya." />
      <PlaceholderNote>Belum ada materi. Kartu di bawah hanya kerangka tampilan, bukan konten pembelajaran yang sudah diverifikasi.</PlaceholderNote>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TOPICS.map(({ title, text, icon: Icon }) => (
          <li key={title}>
            <Card className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-brand">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <Badge tone="gold">Segera hadir</Badge>
              </div>
              <h2 className="type-card-title mt-4">{title}</h2>
              <p className="type-body mt-1 flex-1">{text}</p>
              <div className="mt-4 space-y-1.5">
                <ProgressBar value={null} label={`Progres belajar ${title}`} />
                <p className="type-caption">Belum dimulai</p>
              </div>
              <Button variant="secondary" className="mt-5 self-start" onClick={() => soon(title, 'Materi pembelajaran ini sedang disiapkan.')}>
                Mulai belajar
              </Button>
            </Card>
          </li>
        ))}
      </ul>

      <Link to="/hafalan" className="block rounded-2xl">
        <Card className="flex items-center gap-4 p-4 transition-colors hover:border-primary/40 sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-brand">
            <Brain className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="type-card-title block">Hafalan</span>
            <span className="type-caption block">Catat target dan jadwal murajaah hafalanmu.</span>
          </span>
          <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
        </Card>
      </Link>
    </div>
  )
}
