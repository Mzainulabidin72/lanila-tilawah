import { evaluatePassword } from '@/lib/utils/validation'
import { cn } from '@/lib/utils/cn'

const BAR = ['bg-danger', 'bg-danger', 'bg-accent', 'bg-secondary', 'bg-primary']

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const { score, label } = evaluatePassword(password)
  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn('h-1.5 flex-1 rounded-full', i <= score ? BAR[score] : 'bg-line')} />
        ))}
      </div>
      <p className="text-sm text-muted-strong">Kekuatan kata sandi: {label}</p>
    </div>
  )
}
