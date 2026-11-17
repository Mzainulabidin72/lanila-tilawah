import { Settings } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { configIssues } from '@/config/env'

export function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <Card className="w-full max-w-lg p-6 sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-ink">
          <Settings className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-bold">Konfigurasi Supabase belum lengkap</h1>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-strong">
          {configIssues.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted-strong">
          Salin <code className="rounded bg-canvas px-1.5 py-0.5">.env.example</code> menjadi{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5">.env</code>, isi dua variabel di atas, lalu jalankan ulang
          server pengembangan. Detailnya ada di README.
        </p>
      </Card>
    </div>
  )
}
