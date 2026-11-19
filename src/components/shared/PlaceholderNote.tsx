import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

/** Penanda jelas bahwa sebuah bagian masih placeholder/belum memakai data tervalidasi. */
export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-ink">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p className="leading-snug">{children}</p>
    </div>
  )
}
