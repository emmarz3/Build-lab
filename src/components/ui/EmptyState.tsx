/* ============================================================
   CampusFix — Empty State Component
   ============================================================ */

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title = 'Nothing here yet', description, icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
        {...props}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-strong)]">
          {icon ?? <FileText className="h-8 w-8 text-[var(--color-text-tertiary)]" />}
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
        {description && (
          <p className="mt-2 max-w-sm text-sm text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'
