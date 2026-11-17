import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'
import { profileService } from '@/services/profileService'
import { toAppError } from '@/lib/utils/errors'
import type { UserPreferences } from '@/types'

export function ProfilePage() {
  const { user, displayName } = useAuth()
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let active = true
    profileService
      .getPreferences(user.id)
      .then((p) => active && setPrefs(p))
      .catch((e) => active && setError(toAppError(e).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user])

  const rows: Array<[string, string]> = [
    ['Nama', displayName],
    ['Email', user?.email ?? '-'],
    ['Bahasa', prefs?.language === 'id' ? 'Indonesia' : (prefs?.language ?? '-')],
    ['Tema', prefs?.theme === 'light' ? 'Terang' : prefs?.theme === 'dark' ? 'Gelap' : prefs?.theme === 'system' ? 'Ikuti sistem' : '-'],
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold tracking-tight">Profil & Pengaturan</h2>
      {error && <Alert kind="error">{error}</Alert>}
      <Card className="p-5 sm:p-6">
        {loading ? (
          <Spinner />
        ) : (
          <dl className="divide-y divide-line">
            {rows.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                <dt className="text-sm text-muted-strong">{k}</dt>
                <dd className="break-words text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>
      <p className="text-sm text-muted-strong">Pengaturan yang dapat diubah akan ditambahkan di fase berikutnya.</p>
    </div>
  )
}
