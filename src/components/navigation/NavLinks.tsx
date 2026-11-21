import { NavLink } from 'react-router-dom'
import { MAIN_NAV } from '@/config/nav'
import { cn } from '@/lib/utils/cn'

/** Navigasi sidebar. Di tablet (md) hanya ikon; label tampil mulai lg. */
export function NavLinks() {
  return (
    <nav aria-label="Navigasi utama" className="space-y-1">
      {MAIN_NAV.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          title={label}
          className={({ isActive }) =>
            cn(
              'type-nav relative flex min-h-[44px] items-center justify-center gap-3 rounded-xl px-3 transition-colors xl:justify-start',
              isActive ? 'bg-primary-soft text-brand-strong' : 'text-muted-strong hover:bg-primary-soft/60 hover:text-ink',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                aria-hidden
                className={cn('absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary xl:-left-4', !isActive && 'hidden')}
              />
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="sr-only xl:not-sr-only">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
