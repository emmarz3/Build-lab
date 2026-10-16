/* ============================================================
   CampusFix — Status, Priority, Category Badges
   ============================================================ */

import type { IssuePriority, IssueStatus, IssueCategory } from '@/features/reports/report.types'
import { STATUS_LABELS, PRIORITY_LABELS, CATEGORY_LABELS } from '@/features/reports/report.constants'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'
import { Clock, Eye, Wrench, CheckCircle2, ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'

const statusVariant: Record<IssueStatus, 'default' | 'info' | 'warning' | 'success' | 'neutral'> = {
  submitted: 'info',
  'under-review': 'info',
  'in-progress': 'warning',
  resolved: 'success',
}

const statusIcons: Record<IssueStatus, React.ElementType> = {
  submitted: Clock,
  'under-review': Eye,
  'in-progress': Wrench,
  resolved: CheckCircle2,
}

export interface StatusBadgeProps {
  status: IssueStatus
  className?: string
  dot?: boolean
  showIcon?: boolean
}

export function StatusBadge({ status, className, dot = false, showIcon = false }: StatusBadgeProps) {
  const label = STATUS_LABELS[status]
  const Icon = statusIcons[status]
  return (
    <Badge
      variant={statusVariant[status]}
      dot={dot}
      className={cn('text-xs font-medium capitalize', className)}
    >
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  )
}

const priorityVariant: Record<IssuePriority, 'default' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

const priorityIcons: Record<IssuePriority, React.ElementType> = {
  low: ArrowDown,
  medium: ArrowRight,
  high: ArrowUp,
}

export interface PriorityBadgeProps {
  priority: IssuePriority
  className?: string
  dot?: boolean
  showIcon?: boolean
}

export function PriorityBadge({ priority, className, dot = false, showIcon = false }: PriorityBadgeProps) {
  const label = PRIORITY_LABELS[priority]
  const Icon = priorityIcons[priority]
  return (
    <Badge
      variant={priorityVariant[priority]}
      dot={dot}
      className={cn('text-xs font-medium capitalize', className)}
    >
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  )
}

export interface CategoryBadgeProps {
  category: IssueCategory
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const label = CATEGORY_LABELS[category]
  return (
    <Badge variant="neutral" className={cn('text-xs font-medium', className)}>
      {label}
    </Badge>
  )
}
