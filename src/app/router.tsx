/* ============================================================
   CampusFix — Application Router
   ============================================================ */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { NewReportPage } from '@/pages/NewReportPage'
import { ReportDetailPage } from '@/pages/ReportDetailPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ReportsProvider } from '@/features/reports/ReportsContext'
import { PageTransition } from '@/components/ui/PageTransition'

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReportsProvider>
      <AppShell>
        <PageTransition>{children}</PageTransition>
      </AppShell>
    </ReportsProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout><LandingPage /></RootLayout>,
  },
  {
    path: '/issues',
    element: <RootLayout><ReportsPage /></RootLayout>,
  },
  {
    path: '/issues/new',
    element: <RootLayout><NewReportPage /></RootLayout>,
  },
  {
    path: '/issues/:id',
    element: <RootLayout><ReportDetailPage /></RootLayout>,
  },
  {
    path: '/reports',
    element: <RootLayout><ReportsPage /></RootLayout>,
  },
  {
    path: '/reports/new',
    element: <RootLayout><NewReportPage /></RootLayout>,
  },
  {
    path: '/reports/:id',
    element: <RootLayout><ReportDetailPage /></RootLayout>,
  },
  {
    path: '/dashboard',
    element: <RootLayout><DashboardPage /></RootLayout>,
  },
  {
    path: '/about',
    element: <RootLayout><div className="py-12"><h1>About CampusFix</h1><p className="mt-4 text-[var(--color-text-secondary)]">A campus issue reporting and tracking platform prototype.</p></div></RootLayout>,
  },
  {
    path: '*',
    element: <RootLayout><NotFoundPage /></RootLayout>,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
