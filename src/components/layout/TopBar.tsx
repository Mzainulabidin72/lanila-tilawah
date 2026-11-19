import { useLocation } from 'react-router-dom'
import { findNavItem } from '@/config/nav'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ProfileMenu } from './ProfileMenu'

export function TopBar() {
  const { pathname } = useLocation()
  const current = findNavItem(pathname)

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <div className="min-w-0">
          <Logo className="md:hidden" />
          <p className="type-caption hidden md:block">
            Lanila Tilawah{current ? <span aria-hidden> / </span> : null}
            {current && <span className="font-semibold text-ink">{current.label}</span>}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle className="hidden md:inline-flex" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
