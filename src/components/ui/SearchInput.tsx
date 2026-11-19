import { useId } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
}

export function SearchInput({ value, onChange, placeholder, label }: Props) {
  const id = useId()
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
      <input
        id={id}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[48px] w-full rounded-xl border border-line bg-surface pl-11 pr-12 text-base text-ink placeholder:text-muted [&::-webkit-search-cancel-button]:hidden focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted-strong hover:bg-primary-soft"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
