/* ============================================================
   CampusFix — Page Transition
   Subtle entrance animation when navigating between major views.
   Respects prefers-reduced-motion.
   ============================================================ */

import { useLocation } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation()
  const [entering, setEntering] = useState(true)

  // Restart the entrance animation whenever the route changes
  useEffect(() => {
    setEntering(true)
    const timer = setTimeout(() => setEntering(false), 220)
    return () => clearTimeout(timer)
  }, [location.key])

  return (
    <div className={cn(entering ? 'fade-in' : '', className)}>
      {children}
    </div>
  )
}
