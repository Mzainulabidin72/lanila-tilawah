import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'
const STORAGE_KEY = 'lanila-tilawah-theme'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light' // default: terang
  } catch {
    return 'light'
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0F1512' : '#087F68')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  useEffect(() => applyTheme(theme), [theme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* penyimpanan diblokir: tema tetap berlaku untuk sesi ini */
    }
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }),
    [theme, setTheme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
