import { Logo } from './Logo'
import { Spinner } from '@/components/ui/Spinner'

export function FullScreenLoader({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas">
      <Logo />
      <Spinner label={label} />
    </div>
  )
}
