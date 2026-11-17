import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { NAV_ITEMS } from '@/config/nav'
import { cn } from '@/lib/utils/cn'

const PRIMARY = NAV_ITEMS.slice(0, 4)

export function MobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <nav
      aria-label="Navigasi bawah"
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {PRIMARY.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium',
                  isActive ? 'text-primary-dark' : 'text-muted-strong',
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="max-w-full truncate">{label}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium text-muted-strong"
          >
            <Menu className="h-5 w-5" aria-hidden />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  )
}
