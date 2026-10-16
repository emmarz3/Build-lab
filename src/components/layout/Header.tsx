/* ============================================================
   CampusFix — Header Component
   ============================================================ */

import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, PlusCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { NAV_ITEMS, REPORT_ACTION } from './nav-config.tsx'
import { LinkButton } from '@/components/ui/LinkButton'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
  }, [mobileMenuOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'text-[var(--color-primary)] bg-[var(--color-primary-subtle)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-strong)]'
    )

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur">
      <div className="container flex h-[var(--layout-header-height)] items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} to={item.href} className={navLinkClass} end>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Actions (Report an Issue) */}
        <div className="flex items-center gap-2">
          <LinkButton
            to={REPORT_ACTION.href}
            icon={<PlusCircle className="h-4 w-4" />}
            size="sm"
            className="hidden sm:inline-flex"
          >
            Report an Issue
          </LinkButton>
          <NavLink
            to={REPORT_ACTION.href}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]',
              'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              'hover:bg-[var(--color-surface-strong)] focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)] sm:hidden'
            )}
            aria-label="Report an Issue"
          >
            <PlusCircle className="h-5 w-5" />
          </NavLink>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="fixed top-0 left-0 z-50 flex h-full w-72 flex-col gap-6 overflow-y-auto bg-[var(--color-surface)] border-r border-[var(--color-border)] p-4 shadow-lg lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} to={item.href} className={navLinkClass} end>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <LinkButton
                to={REPORT_ACTION.href}
                icon={<PlusCircle className="h-4 w-4" />}
                className="mt-2 w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Report an Issue
              </LinkButton>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
