import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { readJSON, writeJSON } from '@/lib/storage/localStore'

export interface ReaderPrefs {
  /** 1–5 */
  arabicSize: number
  /** 1–3 */
  translationSize: number
  showTranslation: boolean
}

export const ARABIC_SIZES_REM = [1.5, 1.75, 2, 2.25, 2.6] as const
export const TRANSLATION_SIZES_REM = [0.9375, 1.0625, 1.25] as const
const KEY = 'lanila-tilawah-reader-prefs'
const DEFAULTS: ReaderPrefs = { arabicSize: 3, translationSize: 2, showTranslation: true }

const clamp = (n: unknown, min: number, max: number, d: number) => (typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : d)

function load(): ReaderPrefs {
  const raw = readJSON<Partial<ReaderPrefs>>(KEY, {})
  return {
    arabicSize: clamp(raw.arabicSize, 1, 5, DEFAULTS.arabicSize),
    translationSize: clamp(raw.translationSize, 1, 3, DEFAULTS.translationSize),
    showTranslation: typeof raw.showTranslation === 'boolean' ? raw.showTranslation : DEFAULTS.showTranslation,
  }
}

export interface ReaderPrefsValue {
  prefs: ReaderPrefs
  setPrefs: (patch: Partial<ReaderPrefs>) => void
  reset: () => void
}
export const ReaderPrefsContext = createContext<ReaderPrefsValue | null>(null)

export function ReaderPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setState] = useState<ReaderPrefs>(load)

  const setPrefs = useCallback((patch: Partial<ReaderPrefs>) => {
    setState((p) => {
      const next = { ...p, ...patch }
      writeJSON(KEY, next)
      return next
    })
  }, [])
  const reset = useCallback(() => {
    writeJSON(KEY, DEFAULTS)
    setState(DEFAULTS)
  }, [])

  const value = useMemo(() => ({ prefs, setPrefs, reset }), [prefs, setPrefs, reset])
  return <ReaderPrefsContext.Provider value={value}>{children}</ReaderPrefsContext.Provider>
}
