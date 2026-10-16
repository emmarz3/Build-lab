/* ============================================================
   CampusFix — Button Component
   ============================================================ */

import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconOnly?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2',
  secondary:
    'bg-[var(--color-surface-strong)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2',
  outline:
    'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-primary-subtle)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-strong)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2',
  danger:
    'bg-[var(--color-danger)] text-white hover:bg-[#991c1c] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2',
  success:
    'bg-[var(--color-success)] text-white hover:bg-[#14532d] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconOnly = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-md)]',
          'font-medium transition-colors focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          iconOnly ? 'w-auto aspect-square p-0' : '',
          className
        )}
        {...props}
      >
        {icon && iconOnly ? (
          <span className="flex items-center justify-center">{icon}</span>
        ) : icon ? (
          <span className="flex items-center gap-2">
            {icon}
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
