import { cn } from '@/lib/utils/cn'

/**
 * PLACEHOLDER. Ganti dengan aset resmi master logo Lanila
 * (taruh di public/ atau src/assets/) sebelum rilis. Simbol dan wordmark
 * resmi tidak boleh diubah; komponen ini hanya penampung sementara.
 */
export function Logo({ className, showWordmark = true, light = false }: { className?: string; showWordmark?: boolean; light?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" role="img" aria-label="Lanila">
        <rect width="32" height="32" rx="9" fill={light ? '#FFFFFF' : '#087F68'} />
        <path d="M10 8v14h9" fill="none" stroke={light ? '#087F68' : '#fff'} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21.5" cy="10.5" r="2.2" fill="#D6B66A" />
      </svg>
      {showWordmark && (
        <div className="leading-tight">
          <p className={cn('text-lg font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>Lanila</p>
          <p className={cn('text-xs font-medium', light ? 'text-white/80' : 'text-primary')}>Tilawah</p>
        </div>
      )}
    </div>
  )
}
