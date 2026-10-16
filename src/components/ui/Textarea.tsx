/* ============================================================
   CampusFix — Textarea Component
   ============================================================ */

import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const inputId = id ?? `textarea-${Math.random().toString(36).slice(2, 10)}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full rounded-[var(--radius-sm)] border bg-[var(--color-surface)]',
            'px-3 py-2 text-base text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-tertiary)]',
            'transition-colors focus:outline-none focus:border-[var(--color-primary)]',
            'focus:ring-2 focus:ring-[var(--color-primary-focus)] focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'resize-y min-h-[80px]',
            error
              ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/30'
              : 'border-[var(--color-border)]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-[var(--color-danger)]"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
