import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'
const STORAGE_KEY = 'lanila-tilawah-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

export interface ThemeContextValue {
  /** Pilihan pengguna (light | dark | system). */
  theme: Theme
  /** Tema yang benar-benar tampil saat ini. */
  resolvedTheme: ResolvedTheme
  setTheme: (t: Theme) => void
  /** Beralih terang/gelap secara eksplisit berdasarkan tema yang sedang tampil. */
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'dark' || v === 'system' ? v : 'light' // default: terang
  } catch {
    return 'light'
  }
}

const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches
const resolve = (t: Theme): ResolvedTheme => (t === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : t)

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#111A17' : '#167C65')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [resolvedTheme, setResolved] = useState<ResolvedTheme>(() => resolve(readStoredTheme()))

  useEffect(() => {
    const update = () => {
      const r = resolve(theme)
      setResolved(r)
      applyTheme(r)
    }
    update()
    if (theme !== 'system') return
    const mq = window.matchMedia(DARK_QUERY)
    mq.addEventListener('change', update) // ikuti perubahan tema OS secara langsung
    return () => mq.removeEventListener('change', update)
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* penyimpanan diblokir: tema tetap berlaku untuk sesi ini */
    }
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') }),
    [theme, resolvedTheme, setTheme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
