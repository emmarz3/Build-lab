/* ============================================================
   CampusFix — ReportCard Component
   ============================================================ */

import type { IssueReport } from '@/features/reports/report.types'
import { cn, formatDateRelative } from '@/lib/utils'
import { Card } from '../ui/Card'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../ui/StatusBadge'
import { Clock, MapPin, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface ReportCardProps {
  report: IssueReport
  className?: string
}

export function ReportCard({ report, className }: ReportCardProps) {
  const statusColors: Record<string, string> = {
    submitted: 'ring-[var(--color-status-submitted)]/30',
    'under-review': 'ring-[var(--color-status-review)]/30',
    'in-progress': 'ring-[var(--color-status-progress)]/30',
    resolved: 'ring-[var(--color-status-resolved)]/30',
  }

  return (
    <Card
      className={cn(
        'group relative flex flex-col gap-3 cursor-pointer',
        'hover:shadow-[var(--shadow-md)] transition-shadow',
        statusColors[report.status] || '',
        className
      )}
    >
      <Link to={`/reports/${report.id}`} className="absolute inset-0" aria-label={`View report: ${report.title}`} />

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
          {report.title}
        </h3>
        <StatusBadge status={report.status} showIcon />
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
        {report.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <CategoryBadge category={report.category} />
        <PriorityBadge priority={report.priority} />
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{report.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <time dateTime={report.createdAt}>{formatDateRelative(report.createdAt)}</time>
        </div>
      </div>

      <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 opacity-0 text-[var(--color-text-tertiary)] transition-opacity group-hover:opacity-100" />
    </Card>
  )
}

// Re-export badges to avoid unused import lint errors
export { StatusBadge, PriorityBadge, CategoryBadge }
