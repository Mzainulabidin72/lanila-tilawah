import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { IconButton } from './IconButton'
import { Tooltip } from './Tooltip'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { profileService } from '@/services/profileService'
import { cn } from '@/lib/utils/cn'
import type { Theme } from '@/contexts/ThemeContext'

/** Tema disimpan di perangkat (localStorage) dan disinkronkan ke user_preferences bila memungkinkan. */
function useThemeChange() {
  const { setTheme } = useTheme()
  const { user } = useAuth()
  return (t: Theme) => {
    setTheme(t)
    if (user) void profileService.updateTheme(user.id, t).catch(() => undefined)
  }
}

const OPTIONS: Array<{ value: Theme; label: string; icon: LucideIcon }> = [
  { value: 'light', label: 'Terang', icon: Sun },
  { value: 'dark', label: 'Gelap', icon: Moon },
  { value: 'system', label: 'Sistem', icon: Monitor },
]

export function ThemeToggle({ variant = 'icon', className }: { variant?: 'icon' | 'segmented'; className?: string }) {
  const { theme, resolvedTheme } = useTheme()
  const change = useThemeChange()

  if (variant === 'icon') {
    const dark = resolvedTheme === 'dark'
    const label = dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'
    return (
      <Tooltip label={label} className={className}>
        <IconButton icon={dark ? Sun : Moon} label={label} onClick={() => change(dark ? 'light' : 'dark')} />
      </Tooltip>
    )
  }

  return (
    <div role="radiogroup" aria-label="Tema tampilan" className={cn('grid grid-cols-3 gap-1 rounded-xl border border-line bg-canvas p-1', className)}>
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => change(value)}
            className={cn(
              'flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-semibold transition-colors',
              active ? 'bg-surface text-brand-strong shadow-card' : 'text-muted-strong hover:text-ink',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
