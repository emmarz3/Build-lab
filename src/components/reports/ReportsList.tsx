/* ============================================================
   CampusFix — ReportsList
   Renders a responsive grid of ReportCard components, loading
   skeletons, or an empty state.
   ============================================================ */

import type { IssueReport } from '@/features/reports/report.types'
import { ReportCard } from '@/components/reports/ReportCard'
import { SkeletonReportRow } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileText } from 'lucide-react'

export interface ReportsListProps {
  reports: IssueReport[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function ReportsList({
  reports,
  loading = false,
  emptyTitle = 'No reports found',
  emptyDescription = 'Try adjusting your search or filters.',
}: ReportsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonReportRow key={i} />
        ))}
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<FileText className="h-8 w-8 text-[var(--color-text-tertiary)]" />}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}
