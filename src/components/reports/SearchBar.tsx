/* ============================================================
   CampusFix — SearchBar Component
   ============================================================ */

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  'aria-label'?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search reports...',
  className,
  ...props
}: SearchBarProps) {
  const [internal, setInternal] = useState(value)

  // Sync when parent value changes (e.g. reset)
  useEffect(() => {
    setInternal(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setInternal(val)
      onChange(val)
    },
    [onChange]
  )

  const clear = useCallback(() => {
    setInternal('')
    onChange('')
  }, [onChange])

  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-tertiary)]"
        aria-hidden="true"
      />
      <input
        type="search"
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-[var(--radius-md)] border border-[var(--color-border)]',
          'bg-[var(--color-surface)] pl-10 pr-10 py-2.5',
          'text-base text-[var(--color-text-primary)]',
          'placeholder:text-[var(--color-text-tertiary)]',
          'transition-colors focus:outline-none focus:border-[var(--color-primary)]',
          'focus:ring-2 focus:ring-[var(--color-primary-focus)]',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
        {...props}
      />
      {internal.length > 0 && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
