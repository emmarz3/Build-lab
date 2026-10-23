/* ============================================================
   CampusFix — Dashboard Page
   Operations dashboard with summary stats, breakdowns, and recent reports.
   ============================================================ */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  BarChart2,
  Tag,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/LinkButton'
import { ReportCard } from '@/components/reports/ReportCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useReports } from '@/features/reports/ReportsContext'
import {
  countByStatus,
  countByCategory,
  countByPriority,
  countOpenReports,
  countInProgress,
  countResolved,
  sortReports,
  type ReportSortKey,
} from '@/features/reports/report.selectors'
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
  ALL_STATUSES,
  ALL_PRIORITIES,
  ALL_CATEGORIES,
} from '@/features/reports/report.constants'
import type { IssueReport } from '@/features/reports/report.types'

/** Summary stat card for the dashboard header. */
interface StatCardProps {
  label: string
  value: number
  icon: React.ElementType
  iconColor: string
  bgColor: string
  borderColor: string
  href?: string
  trend?: { value: number; label: string; positive: boolean }
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  href,
  trend,
}: StatCardProps) {
  const content = (
    <Card padding="md" className="flex flex-col gap-2 min-h-[120px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
          <p className="mt-1 text-3xl font-bold text-[var(--color-text-primary)]">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)]"
          style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
      </div>
      {trend && (
        <div
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: trend.positive ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          <span>{trend.positive ? '↑' : '↓'} {trend.value}%</span>
          <span className="text-[var(--color-text-tertiary)]">{trend.label}</span>
        </div>
      )}
    </Card>
  )

  if (href) {
    return (
      <Link to={href} className="text-decoration-none" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }
  return content
}

/** Breakdown section for status/priority/category. */
interface BreakdownItem {
  key: string
  label: string
  count: number
  variant: BadgeVariant
  icon?: React.ElementType
  iconColor?: string
}

interface BreakdownSectionProps {
  title: string
  icon: React.ElementType
  items: BreakdownItem[]
  total: number
  showPercentages?: boolean
}

function BreakdownSection({
  title,
  icon: Icon,
  items,
  total,
  showPercentages = true,
}: BreakdownSectionProps) {
  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[var(--color-text-secondary)]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {item.icon && (
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-md)] shrink-0"
                  style={{ backgroundColor: `${item.iconColor}15`, color: item.iconColor }}
                >
                  <item.icon className="h-3.5 w-3.5" />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {item.label}
                </p>
                {showPercentages && total > 0 && (
                  <div className="mt-1 h-1.5 w-full max-w-[150px] bg-[var(--color-surface-strong)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(item.count / total) * 100}%`,
                        backgroundColor: `var(--color-${item.variant})`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={item.variant} className="text-xs">
                {item.count}
              </Badge>
              {showPercentages && total > 0 && (
                <span className="text-xs text-[var(--color-text-tertiary)] w-10 text-right">
                  {Math.round((item.count / total) * 100)}%
                </span>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">
            No data available
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/** Recent reports section with sorting. */
function RecentReportsSection({ reports }: { reports: IssueReport[] }) {
  const [sortBy, setSortBy] = useState<ReportSortKey>('newest')
  const [showAll, setShowAll] = useState(false)

  const sortedReports = useMemo(() => sortReports(reports, sortBy), [reports, sortBy])
  const displayReports = showAll ? sortedReports : sortedReports.slice(0, 5)

  if (reports.length === 0) {
    return (
      <Card padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--color-text-secondary)]" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<FileText className="h-8 w-8 text-[var(--color-text-tertiary)]" />}
            title="No reports yet"
            description="Reports will appear here once they are created."
            action={
              <LinkButton to="/reports/new" size="sm">
                Report an Issue
              </LinkButton>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--color-text-secondary)]" />
            Recent Reports
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ReportSortKey)}
              className="h-8 px-3 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              aria-label="Sort reports"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority">Priority (high → low)</option>
              <option value="status">Status order</option>
            </select>
            {reports.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
              >
                {showAll ? 'Show less' : 'Show all'}
              </button>
            )}
            <LinkButton to="/reports" variant="ghost" size="sm" icon={<TrendingUp className="h-3.5 w-3.5" />}>
              View all
            </LinkButton>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-[var(--color-border)]">
          {displayReports.map((report) => (
            <Link key={report.id} to={`/reports/${report.id}`} className="block">
              <ReportCard report={report} className="m-4 rounded-[var(--radius-md)] hover:shadow-none" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { reports, loading, error } = useReports()

  // Compute all statistics
  const stats = useMemo(() => {
    if (!reports.length) return null

    const statusCounts = countByStatus(reports)
    const categoryCounts = countByCategory(reports)
    const priorityCounts = countByPriority(reports)
    const total = reports.length
    const open = countOpenReports(reports)
    const inProgress = countInProgress(reports)
    const resolved = countResolved(reports)

    // Status breakdown items
    const statusItems: BreakdownItem[] = ALL_STATUSES.map((status) => ({
      key: status,
      label: STATUS_LABELS[status],
      count: statusCounts[status] ?? 0,
      variant: (
        status === 'resolved' ? 'success' :
        status === 'in-progress' ? 'warning' :
        'info'
      ) as BadgeVariant,
      iconColor: (
        status === 'resolved' ? 'var(--color-success)' :
        status === 'in-progress' ? 'var(--color-warning)' :
        'var(--color-info)'
      ),
    }))

    // Priority breakdown items
    const priorityItems: BreakdownItem[] = ALL_PRIORITIES.map((priority) => ({
      key: priority,
      label: PRIORITY_LABELS[priority],
      count: priorityCounts[priority] ?? 0,
      variant: (
        priority === 'high' ? 'danger' :
        priority === 'medium' ? 'warning' :
        'success'
      ) as BadgeVariant,
      icon: (
        priority === 'high' ? ArrowUp :
        priority === 'medium' ? ArrowRight :
        ArrowDown
      ),
      iconColor: (
        priority === 'high' ? 'var(--color-danger)' :
        priority === 'medium' ? 'var(--color-warning)' :
        'var(--color-success)'
      ),
    }))

    // Category breakdown items
    const categoryItems: BreakdownItem[] = ALL_CATEGORIES.map((category) => ({
      key: category,
      label: CATEGORY_LABELS[category],
      count: categoryCounts[category] ?? 0,
      variant: 'neutral' as BadgeVariant,
      iconColor: 'var(--color-primary)',
    })).filter((item) => item.count > 0)

    return {
      total,
      open,
      inProgress,
      resolved,
      statusItems,
      priorityItems,
      categoryItems,
    }
  }, [reports])

  // Loading skeleton
  if (loading) {
    return (
      <div className="py-6 space-y-6">
        <PageHeader title="Dashboard" description="Operations overview and key metrics" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[280px]" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="py-6">
        <PageHeader title="Dashboard" description="Operations overview and key metrics" />
        <Card padding="lg" className="text-center">
          <div className="text-[var(--color-danger)] mb-4">⚠</div>
          <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
          <p className="mt-2 text-[var(--color-text-secondary)]">{error}</p>
        </Card>
      </div>
    )
  }

  // Empty state (no reports at all)
  if (!stats) {
    return (
      <div className="py-6">
        <PageHeader title="Dashboard" description="Operations overview and key metrics" />
        <Card padding="lg">
          <EmptyState
            icon={<BarChart2 className="h-8 w-8 text-[var(--color-text-tertiary)]" />}
            title="No data available"
            description="Create your first report to see dashboard metrics."
            action={
              <LinkButton to="/reports/new" icon={<FileText className="h-4 w-4" />}>
                Report an Issue
              </LinkButton>
            }
          />
        </Card>
      </div>
    )
  }

  const { total, open, inProgress, resolved, statusItems, priorityItems, categoryItems } = stats

  return (
    <div className="py-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Operations overview and key metrics"
        action={
          <LinkButton to="/reports/new" icon={<FileText className="h-4 w-4" />}>
            New Report
          </LinkButton>
        }
      />

      {/* Summary Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Reports"
          value={total}
          icon={FileText}
          iconColor="var(--color-primary)"
          bgColor="var(--color-primary-subtle)"
          borderColor="var(--color-primary-border)"
          href="/reports"
        />
        <StatCard
          label="Open Reports"
          value={open}
          icon={Clock}
          iconColor="var(--color-info)"
          bgColor="var(--color-info-bg)"
          borderColor="var(--color-info-border)"
          href="/reports"
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          icon={Wrench}
          iconColor="var(--color-warning)"
          bgColor="var(--color-warning-bg)"
          borderColor="var(--color-warning-border)"
          href="/reports"
        />
        <StatCard
          label="Resolved"
          value={resolved}
          icon={CheckCircle2}
          iconColor="var(--color-success)"
          bgColor="var(--color-success-bg)"
          borderColor="var(--color-success-border)"
          href="/reports"
        />
      </div>

      {/* Breakdown Sections */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Status Breakdown */}
        <BreakdownSection
          title="By Status"
          icon={Tag}
          items={statusItems}
          total={total}
        />

        {/* Priority Breakdown */}
        <BreakdownSection
          title="By Priority"
          icon={TrendingUp}
          items={priorityItems}
          total={total}
        />

        {/* Category Breakdown */}
        <BreakdownSection
          title="By Category"
          icon={Tag}
          items={categoryItems}
          total={total}
        />
      </div>

      {/* Recent Reports */}
      <RecentReportsSection reports={reports} />
    </div>
  )
}