import {
  BookOpen,
  Brain,
  GraduationCap,
  Headphones,
  Home,
  Settings,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

/** Navigasi utama (sidebar desktop/tablet). */
export const MAIN_NAV: readonly NavItem[] = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/quran', label: "Al-Qur'an", icon: BookOpen },
  { path: '/audio', label: 'Audio', icon: Headphones },
  { path: '/belajar', label: 'Belajar', icon: GraduationCap },
  { path: '/hafalan', label: 'Hafalan', icon: Brain },
  { path: '/progres', label: 'Progres', icon: TrendingUp },
]

/** Bottom navigation mobile: 5 tujuan terpenting. Hafalan diakses lewat Belajar, Beranda, dan menu profil. */
export const BOTTOM_NAV: readonly NavItem[] = MAIN_NAV.filter((n) => n.path !== '/hafalan')

export const SETTINGS_ITEM: NavItem = { path: '/profil', label: 'Profil & Pengaturan', icon: Settings }

export function findNavItem(pathname: string): NavItem | undefined {
  return [...MAIN_NAV, SETTINGS_ITEM].find((n) => (n.path === '/' ? pathname === '/' : pathname.startsWith(n.path)))
}
