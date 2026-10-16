/* ============================================================
   CampusFix — PageHeader Component
   ============================================================ */

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}
        {...props}
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
          )}
        </div>
        {action}
      </div>
    )
  }
)
PageHeader.displayName = 'PageHeader'
