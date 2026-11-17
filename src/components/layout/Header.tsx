import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/config/nav'
import { Logo } from '@/components/shared/Logo'
import { UserMenu } from './UserMenu'

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { pathname } = useLocation()
  const current = NAV_ITEMS.find((n) => (n.path === '/' ? pathname === '/' : pathname.startsWith(n.path)))

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Buka menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo className="md:hidden" showWordmark={false} />
        <h1 className="truncate text-base font-semibold sm:text-lg">{current?.label ?? 'Lanila Tilawah'}</h1>
      </div>
      <UserMenu />
    </header>
  )
}
