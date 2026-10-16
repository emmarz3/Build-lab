/* ============================================================
   CampusFix — IconButton Component
   ============================================================ */

import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label?: string
  variant?: 'primary' | 'ghost' | 'outline'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, label, variant = 'ghost', ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
      ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-strong)]',
      outline:
        'bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-subtle)]',
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-sm)]',
          'h-9 w-9 text-base transition-colors focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]',
          'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    )
  }
)
IconButton.displayName = 'IconButton'
