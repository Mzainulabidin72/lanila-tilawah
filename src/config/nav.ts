import {
  BookOpen,
  Brain,
  GraduationCap,
  Headphones,
  Home,
  TrendingUp,
  UserCog,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  description: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/', label: 'Beranda', icon: Home, description: 'Ringkasan aktivitas tilawah kamu.' },
  { path: '/quran', label: "Al-Qur'an", icon: BookOpen, description: "Baca Al-Qur'an dengan nyaman." },
  { path: '/audio', label: 'Audio', icon: Headphones, description: 'Dengarkan murottal dan bacaan.' },
  { path: '/belajar', label: 'Belajar', icon: GraduationCap, description: 'Pahami makna dan tajwid.' },
  { path: '/hafalan', label: 'Hafalan', icon: Brain, description: 'Catat dan ulangi hafalan.' },
  { path: '/progres', label: 'Progres', icon: TrendingUp, description: 'Pantau kebiasaan membaca.' },
  { path: '/profil', label: 'Profil & Pengaturan', icon: UserCog, description: 'Kelola akun dan preferensi.' },
]
