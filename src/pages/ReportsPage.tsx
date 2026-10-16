/* ============================================================
   CampusFix — Reports Page
   ============================================================ */

import { useReports } from '@/features/reports/ReportsContext'

export function ReportsPage() {
  const { reports } = useReports()
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <p className="mt-2 text-[var(--color-text-secondary)]">
        Found {reports.length} reports.
      </p>
    </div>
  )
}
