/* ============================================================
   CampusFix — Pages (shells built out in subsequent phases)
   ============================================================ */

import { Link } from 'react-router-dom'

export function DashboardPage() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-[var(--color-text-secondary)]">
        Operations dashboard coming in Phase 5.
      </p>
      <Link
        to="/reports"
        className="mt-4 inline-flex text-[var(--color-primary)]"
      >
        ← Back to reports
      </Link>
    </div>
  )
}
