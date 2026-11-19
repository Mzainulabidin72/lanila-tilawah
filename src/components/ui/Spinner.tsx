import { Loader2 } from 'lucide-react'

export function Spinner({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 text-muted-strong">
      <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}
