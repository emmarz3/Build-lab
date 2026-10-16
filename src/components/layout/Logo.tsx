/* ============================================================
   CampusFix — Logo Component
   ============================================================ */

import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-xl font-bold no-underline">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]"
        style={{
          backgroundColor: 'var(--color-primary-subtle)',
          color: 'var(--color-primary)',
        }}
        aria-hidden="true"
      >
        <span className="text-sm font-bold">CF</span>
      </span>
      <span className="text-[var(--color-text-primary)]">Campus<span className="text-[var(--color-primary)]">Fix</span></span>
    </Link>
  )
}
