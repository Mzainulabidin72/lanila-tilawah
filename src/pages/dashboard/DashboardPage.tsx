import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Headphones, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'

const PILLARS = [
  { to: '/quran', icon: BookOpen, title: 'Read', text: "Baca Al-Qur'an." },
  { to: '/audio', icon: Headphones, title: 'Listen', text: 'Dengarkan bacaan.' },
  { to: '/belajar', icon: GraduationCap, title: 'Learn', text: 'Pelajari maknanya.' },
  { to: '/progres', icon: TrendingUp, title: 'Grow', text: 'Pantau progres.' },
]

export function DashboardPage() {
  const { displayName } = useAuth()
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Assalamu’alaikum, {displayName}</h2>
        <p className="mt-2 text-muted-strong">Selamat datang di teman tilawah pribadimu.</p>
      </div>

      <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map(({ to, icon: Icon, title, text }) => (
          <li key={to}>
            <Link to={to} className="block h-full rounded-2xl focus-visible:ring-offset-2">
              <Card className="h-full p-5 transition-colors hover:border-primary/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-4 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-strong">{text}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
