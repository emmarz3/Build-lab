/* ============================================================
   CampusFix — Report Detail Page
   Displays a single issue report with full details, activity
   history, and status management actions.
   ============================================================ */

import { useParams, Link, useNavigate } from 'react-router-dom'
import { useReports } from '@/features/reports/ReportsContext'
import { useSavedIssues } from '@/hooks/useSavedIssues'
import { fetchIssue } from '@/services/issueApi'
import { getNextStatuses } from '@/features/reports/report.constants'
import { STATUS_LABELS } from '@/features/reports/report.constants'
import type { IssueReport, IssueStatus } from '@/features/reports/report.types'
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/ui/StatusBadge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn, formatDate } from '@/lib/utils'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Trash2,
  Bookmark,
  User,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { reports, loading, updateStatus, deleteReport } = useReports()
  const { isSaved, toggle } = useSavedIssues()
  const saved = id ? isSaved(id) : false
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [fetched, setFetched] = useState<IssueReport | null>(null)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const report = id ? (reports.find((r) => r.id === id) ?? fetched) : undefined

  useEffect(() => {
    if (!id) return
    if (reports.find((r) => r.id === id)) return
    setFetching(true)
    setFetchError(null)
    fetchIssue(id)
      .then(setFetched)
      .catch((e) => setFetchError(e instanceof Error ? e.message : 'Failed to load issue.'))
      .finally(() => setFetching(false))
  }, [id, reports])

  // ----- Handlers -------------------------------------------------------

  const handleStatusChange = async (newStatus: string) => {
    if (!report) return
    setIsUpdating(true)
    try {
      await updateStatus(report.id, newStatus as IssueStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!report) return
    if (!window.confirm(`Delete "${report.title}"? This cannot be undone.`)) return
    setIsDeleting(true)
    try {
      await deleteReport(report.id)
      navigate('/issues')
    } finally {
      setIsDeleting(false)
    }
  }

  // ----- Loading --------------------------------------------------------

  if (loading || fetching) {
    return (
      <div className="space-y-4 py-6">
        <div className="h-8 w-48 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-strong)]" />
        <div className="h-96 w-full animate-pulse rounded-[var(--radius-lg)]] bg-[var(--color-surface-strong)]" />
      </div>
    )
  }

  // ----- Not found ------------------------------------------------------

  if (!report || fetchError) {
    return (
      <div className="py-12 text-center">
        <Clock className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)]" />
        <h2 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">Report not found</h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          The report you’re looking for doesn’t exist or has been deleted.
        </p>
        <LinkButton href="/issues" label="Back to reports" icon={<ArrowLeft className="h-4 w-4" />} />
      </div>
    )
  }

  // ----- Helpers --------------------------------------------------------

  const nextStatuses = getNextStatuses(report.status)
  const statusOptions: { value: string; label: string }[] = nextStatuses.map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  }))

  return (
    <>
      <PageHeader
        title={report.title}
        description={`Reported ${formatDate(report.createdAt)} — Status: ${STATUS_LABELS[report.status]}`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Edit className="h-4 w-4" />} />
            <Button
              variant={saved ? 'primary' : 'outline'}
              size="sm"
              icon={<Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />}
              onClick={() => id && toggle(id)}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
              disabled={isDeleting}
              onClick={handleDelete}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Main content ---- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardDescription>
              {report.description}
            </CardDescription>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <MapPin className="h-4 w-4" />
              <span>{report.location}</span>
            </div>
          </Card>

          {/* Activity timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Chronological log of status changes and actions.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {report.activity.length === 0 ? (
                <p className="text-sm text-[var(--color-text-tertiary)]">No activity recorded yet.</p>
              ) : (
                report.activity.map((item, idx) => (
                  <ActivityResult key={item.id} activity={item} isLast={idx === report.activity.length - 1} />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* ---- Sidebar ---- */}
        <div className="space-y-6">
          {/* Quick info */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-sm">
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Created"
                value={formatDate(report.createdAt)}
              />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Updated"
                value={formatDate(report.updatedAt)}
              />
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={report.location}
              />
              <DetailRow
                icon={<User className="h-4 w-4" />}
                label="Reporter"
                value={report.reporter ?? 'Anonymous'}
              />
            </div>
          </Card>

          {/* Categories / priorities */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Category</span>
                <CategoryBadge category={report.category} className="mt-1" />
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Priority</span>
                <PriorityBadge priority={report.priority} showIcon className="mt-1" />
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Status</span>
                <StatusBadge status={report.status} showIcon className="mt-1" />
              </div>
            </div>
          </Card>

          {/* Status change */}
          {statusOptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Change Status</CardTitle>
                <CardDescription>
                  Advance this report to the next stage in the workflow.
                </CardDescription>
              </CardHeader>
              <Select
                disabled={isUpdating}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="" disabled>Select next status…</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

/** A single detail row in the sidebar. */
function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
        {icon}
        {label}
      </span>
      <span className="font-medium text-[var(--color-text-primary)]">{value}</span>
    </div>
  )
}

/** A timeline item for the activity history. */
function ActivityResult({ activity, isLast }: { activity: IssueReport['activity'][number]; isLast: boolean }) {
  const bgColor = activity.status === 'resolved'
    ? 'bg-[var(--color-success-bg)]'
    : activity.status === 'in-progress'
      ? 'bg-[var(--color-warning-bg)]'
      : activity.status === 'under-review'
        ? 'bg-[var(--color-info-bg)]'
        : 'bg-[var(--color-surface-strong)]'

  return (
    <div className="relative pl-6">
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-2 top-5 h-full w-0.5 bg-[var(--color-border)]"
        />
      )}
      {/* Dot */}
      <div
        className={cn(
          "absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white",
          bgColor
        )}
      />
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <StatusBadge status={activity.status} dot />
          <time dateTime={activity.timestamp} className="text-xs text-[var(--color-text-tertiary)]">
            {formatDate(activity.timestamp)}
          </time>
        </div>
        <p className="text-sm text-[var(--color-text-primary)]">{activity.description}</p>
        {activity.performedBy && (
          <p className="text-xs text-[var(--color-text-secondary)]">by {activity.performedBy}</p>
        )}
      </div>
    </div>
  )
}

/** A small LinkButton used for the back-to-reports fallback. */
function LinkButton({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      to={href}
      className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium
        bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]
        focus-visible:ring-offset-2"
    >
      {icon}
      {label}
    </Link>
  )
}
