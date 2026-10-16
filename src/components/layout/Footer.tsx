/* ============================================================
   CampusFix — Footer Component
   ============================================================ */

import { Link } from 'react-router-dom'
import { NAV_ITEMS } from './nav-config'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              CampusFix
            </h3>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Report campus maintenance issues and track their resolution.
              A prototype frontend application for campus operations teams.
            </p>
            <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
              Data is stored locally in your browser.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Legal
            </h4>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              CampusFix is a demonstrator prototype. Data persists only in your
              browser's local storage and is not shared with any institution.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-tertiary)]">
          <p>&copy; {year} CampusFix. Prototype application for BuildLab Stage 1.</p>
        </div>
      </div>
    </footer>
  )
}
