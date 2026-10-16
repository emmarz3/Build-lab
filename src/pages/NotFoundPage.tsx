/* ============================================================
   CampusFix — Not Found Page
   ============================================================ */

import { LinkButton } from '@/components/ui/LinkButton'
import { Home, Search } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-[var(--color-text-primary)]">404</h1>
      <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
        This page doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex gap-4">
        <LinkButton to="/" icon={<Home className="h-4 w-4" />}>
          Go Home
        </LinkButton>
        <LinkButton to="/reports" variant="outline" icon={<Search className="h-4 w-4" />}>
          Browse Reports
        </LinkButton>
      </div>
    </div>
  )
}
