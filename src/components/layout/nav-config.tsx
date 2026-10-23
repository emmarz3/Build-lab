/* ============================================================
   CampusFix — Navigation Configuration
   ============================================================ */

import type { ReactElement } from 'react'
import { Home, List, BarChart3, PlusCircle, Info } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: ReactElement
  match?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home className="h-5 w-5" />, match: '^/$' },
  { label: 'Reports', href: '/issues', icon: <List className="h-5 w-5" />, match: '^/issues' },
  { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-5 w-5" />, match: '^/dashboard' },
  { label: 'About', href: '/about', icon: <Info className="h-5 w-5" />, match: '^/about' },
]

export const REPORT_ACTION: NavItem = {
  label: 'Report an Issue',
  href: '/issues/new',
  icon: <PlusCircle className="h-5 w-5" />,
  match: '^/issues/new$',
}
