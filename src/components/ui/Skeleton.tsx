/* ============================================================
   CampusFix — Skeleton Component
   ============================================================ */

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-strong)]',
        className
      )}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

/** Predefined skeleton row for report card preview. */
export const SkeletonReportRow = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3 rounded-[var(--radius-lg)] p-5',
        'border border-[var(--color-border)] bg-[var(--color-surface)]',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
)
SkeletonReportRow.displayName = 'SkeletonReportRow'
