import { Link } from 'react-router-dom'
import { BookOpen, Brain, GraduationCap, Headphones, Quote, Target } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button, buttonStyles } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { EmptyState } from '@/components/ui/EmptyState'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { useAuth } from '@/hooks/useAuth'
import { useComingSoon } from '@/hooks/useComingSoon'

function greeting(hour: number): string {
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

const QUICK = [
  { to: '/quran', icon: BookOpen, title: "Baca Al-Qur'an", text: 'Telusuri daftar surah.' },
  { to: '/audio', icon: Headphones, title: 'Dengarkan', text: 'Murottal dan bacaan.' },
  { to: '/belajar', icon: GraduationCap, title: 'Belajar Tajwid', text: 'Pahami cara membaca.' },
  { to: '/hafalan', icon: Brain, title: 'Hafalan', text: 'Catat target hafalan.' },
]

export function HomePage() {
  const { displayName } = useAuth()
  const soon = useComingSoon()

  return (
    <div className="space-y-8">
      <header>
        <p className="type-caption">{greeting(new Date().getHours())},</p>
        <h1 className="type-page-title mt-1 break-words">{displayName}</h1>
        <p className="type-body mt-2">Mulai dari yang kecil, lalu jaga agar tetap konsisten.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="p-5 pb-0 sm:p-6 sm:pb-0">
            <SectionHeader title="Lanjutkan membaca" />
          </div>
          <EmptyState
            icon={BookOpen}
            title="Belum ada bacaan terakhir"
            description="Surah dan ayat terakhir yang kamu baca akan muncul di sini."
            action={
              <Link to="/quran" className={buttonStyles('primary')}>
                Mulai membaca
              </Link>
            }
          />
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeader title="Target harian" />
          <div className="mt-5 flex items-center gap-5 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <ProgressRing value={null} label="Progres target bacaan harian">
              <span className="text-xl font-bold text-muted">—</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="type-card-title">Belum ada target</p>
              <p className="type-caption mt-1">Atur jumlah halaman atau ayat per hari.</p>
              <Button
                variant="secondary"
                className="mt-3"
                onClick={() => soon('Target bacaan harian', 'Pengaturan target dan pelacakan progres tersedia setelah fitur pembaca Al-Qur’an siap.')}
              >
                <Target className="h-4 w-4" aria-hidden />
                Atur target
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <section aria-labelledby="akses-cepat" className="space-y-4">
        <div id="akses-cepat">
          <SectionHeader title="Akses cepat" />
        </div>
        <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {QUICK.map(({ to, icon: Icon, title, text }) => (
            <li key={to}>
              <Link to={to} className="block h-full rounded-2xl">
                <Card className="h-full p-4 transition-colors hover:border-primary/40 sm:p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="type-card-title mt-4">{title}</p>
                  <p className="type-caption mt-1">{text}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="inspirasi" className="space-y-4">
        <div id="inspirasi">
          <SectionHeader title="Inspirasi harian" />
        </div>
        <Card className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-ink">
              <Quote className="h-5 w-5" aria-hidden />
            </span>
            <Badge tone="gold">Placeholder</Badge>
          </div>
          <p className="type-body">Ayat atau renungan harian akan tampil di sini.</p>
          <PlaceholderNote>
            Belum ada ayat yang ditampilkan. Konten Al-Qur’an hanya akan dimuat dari dataset tervalidasi di Part 03.
          </PlaceholderNote>
        </Card>
      </section>
    </div>
  )
}
