import { Spinner } from './Spinner'

export function LoadingState({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <Spinner label={label} />
    </div>
  )
}
