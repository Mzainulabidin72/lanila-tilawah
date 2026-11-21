import { Spinner } from './Spinner'
import { Skeleton } from './Skeleton'

export function LoadingState({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <Spinner label={label} />
    </div>
  )
}

/** Kerangka halaman saat modul halaman (lazy) sedang dimuat. */
export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <span className="sr-only">Memuat halaman…</span>
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-40 lg:col-span-2" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-32" />
    </div>
  )
}
