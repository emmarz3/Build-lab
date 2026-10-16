/* ============================================================
   CampusFix — Landing Page
   ============================================================ */

import { Link } from 'react-router-dom'
import { LinkButton } from '@/components/ui/LinkButton'
import { ChevronRight, FileText, CheckCircle, MapPin, Clock } from 'lucide-react'
import type { IssueReport } from '@/features/reports/report.types'
import { useReports } from '@/features/reports/ReportsContext'

function LandingPage() {
  const { reports } = useReports()

  // Show the 3 most recent reports as a preview
  const recentReports = reports.slice(0, 3)

  const steps = [
    {
      icon: <FileText className="h-6 w-6 text-[var(--color-primary)]" />,
      title: 'Report',
      description: 'Describe the issue with a title, category, location, and priority. Add optional details for context.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-[var(--color-primary)]" />,
      title: 'Track',
      description: 'Follow your report through the status workflow: Submitted → Under Review → In Progress → Resolved.',
    },
    {
      icon: <MapPin className="h-6 w-6 text-[var(--color-primary)]" />,
      title: 'Resolve',
      description: 'Operations staff review and update reports. Every status change is recorded in the activity timeline.',
    },
  ]

  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Report it. Track it. Get it fixed.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
          CampusFix is a campus maintenance reporting platform. Students can
          report issues around campus and track their progress toward resolution.
          Operations staff can review, prioritize, and update reports in a
          centralized interface.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <LinkButton to="/reports/new" size="lg" icon={<FileText className="h-5 w-5" />}>
            Report an Issue
          </LinkButton>
          <LinkButton to="/reports" variant="outline" size="lg">
            Browse Reports
          </LinkButton>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-[var(--color-text-primary)]">
          How it works
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
          Three simple steps to get your campus issue resolved.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]">
                {step.icon}
              </div>
              <span className="mt-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                  {i + 1}
                </span>
                {step.title}
              </span>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent reports preview */}
      <section className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Recent reports
          </h2>
          <Link
            to="/reports"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {recentReports.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            No reports yet. Be the first to report an issue.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentReports.map((report) => (
              <ReportPreviewCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>

      {/* Status tracking explanation */}
      <section className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Track report status
        </h2>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          Each report moves through a clear status workflow. You can see exactly
          where your report is and what to expect next — all from the report
          detail page's activity timeline.
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            Status updates are timestamped
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            Full activity history
          </span>
        </div>
      </section>
    </div>
  )
}

function ReportPreviewCard({ report }: { report: IssueReport }) {
  const statusColors: Record<string, string> = {
    submitted: 'bg-[var(--color-status-submitted-bg)] text-[var(--color-status-submitted)]',
    'under-review': 'bg-[var(--color-status-review-bg)] text-[var(--color-status-review)]',
    'in-progress': 'bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress)]',
    resolved: 'bg-[var(--color-status-resolved-bg)] text-[var(--color-status-resolved)]',
  }

  return (
    <Link
      to={`/reports/${report.id}`}
      className="block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left transition-shadow hover:shadow-[var(--shadow-md)]"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-1">
          {report.title}
        </h3>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[report.status] ?? ''}`}
        >
          {report.status.replace('-', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
        <MapPin className="h-3 w-3" />
        <span className="line-clamp-1">{report.location}</span>
      </div>
    </Link>
  )
}

export { LandingPage }
