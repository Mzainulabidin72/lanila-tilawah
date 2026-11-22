import { useCallback, useEffect, useState } from 'react'
import { toAppError } from '@/lib/utils/errors'

export interface AsyncState<T> {
  data: T | null
  error: string | null
  loading: boolean
  reload: () => void
}

/** Memuat data async dengan pembatalan hasil basi. `load` dipanggil ulang saat deps berubah atau reload(). */
export function useAsync<T>(load: () => Promise<T>, deps: ReadonlyArray<unknown>, enabled = true): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let active = true
    setLoading(true)
    setError(null)
    load()
      .then((d) => active && setData(d))
      .catch((e) => active && setError(toAppError(e).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])
  return { data, error, loading, reload }
}
