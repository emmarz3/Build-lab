/* ============================================================
   CampusFix — Badge Component
   ============================================================ */

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-[var(--color-surface-strong)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
  primary:
    'bg-[var(--color-primary-subtle)] text-[var(--color-primary-hover)] border border-[var(--color-primary-border)]',
  success:
    'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)]',
  warning:
    'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)]',
  danger:
    'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border border-[var(--color-danger-border)]',
  info:
    'bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[var(--color-info-border)]',
  neutral:
    'bg-[var(--color-surface-strong)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', dot = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: 'currentColor',
            }}
          />
        )}
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'
