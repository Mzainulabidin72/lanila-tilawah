import { cn } from '@/lib/utils/cn'

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      // before: memperluas area sentuh menjadi ≥44px tanpa mengubah ukuran visual
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors before:absolute before:-inset-2 before:content-[''] disabled:cursor-not-allowed disabled:opacity-50",
        checked ? 'bg-primary' : 'bg-line',
      )}
    >
      <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  )
}
