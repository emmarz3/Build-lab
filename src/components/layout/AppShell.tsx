/* ============================================================
   CampusFix — AppShell Layout
   Provides the shared layout structure: Header, main content,
   and Footer.
   ============================================================ */

import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
