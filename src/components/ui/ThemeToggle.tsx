import { Moon, Sun } from 'lucide-react'
import { IconButton } from './IconButton'
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

export function ThemeToggle({ variant = 'icon', className }: { variant?: 'icon' | 'segmented'; className?: string }) {
  const { theme } = useTheme()
  const change = useThemeChange()

  if (variant === 'icon') {
    const dark = theme === 'dark'
    return (
      <IconButton
        icon={dark ? Sun : Moon}
        label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
        onClick={() => change(dark ? 'light' : 'dark')}
        className={className}
      />
    )
  }

  const options: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: 'light', label: 'Terang', icon: Sun },
    { value: 'dark', label: 'Gelap', icon: Moon },
  ]
  return (
    <div role="radiogroup" aria-label="Tema tampilan" className={cn('grid grid-cols-2 gap-1 rounded-xl border border-line bg-canvas p-1', className)}>
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => change(value)}
            className={cn(
              'flex min-h-[44px] items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors',
              active ? 'bg-surface text-brand-strong shadow-card' : 'text-muted-strong hover:text-ink',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
