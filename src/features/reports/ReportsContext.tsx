/* ============================================================
   CampusFix — Reports Context (Global State)
   Single source of truth for all report data.
   ============================================================ */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { IssueReport, IssueStatus, IssueCategory, IssuePriority } from './report.types'
import { DEMO_REPORTS } from './demo-data'
import { STORAGE_KEY } from './report.constants'
import { safeStorage, validateStoredReport } from './report.storage'
import {
  updateReportStatus,
  createReport as svcCreateReport,
  removeReport as svcRemoveReport,
} from './report.service'

interface ReportsContextValue {
  reports: IssueReport[]
  loading: boolean
  error: string | null
  createReport: (params: {
    title: string
    description: string
    category: IssueCategory
    location: string
    priority: IssuePriority
    reporter?: string
  }) => Promise<IssueReport>
  updateStatus: (id: string, newStatus: IssueStatus) => Promise<boolean>
  deleteReport: (id: string) => Promise<boolean>
  refresh: () => void
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined)

export function useReports() {
  const ctx = useContext(ReportsContext)
  if (!ctx) {
    throw new Error('useReports must be used within a ReportsProvider')
  }
  return ctx
}

/**
 * Initialize storage with demo data if empty.
 * Never overwrites existing user-created reports.
 */
function initializeStorage(): IssueReport[] {
  const existing = safeStorage.getItem(STORAGE_KEY)
  if (existing) {
    try {
      const parsed = JSON.parse(existing)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .map(validateStoredReport)
          .filter((r): r is IssueReport => r !== null)
      }
    } catch {
      // Malformed data — fall through to re-initialize
    }
  }

  // Seed with demo data
  const demo = DEMO_REPORTS
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
  return demo
}

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<IssueReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize on mount
  useEffect(() => {
    try {
      const initial = initializeStorage()
      setReports(initial)
    } catch {
      setError('Failed to load reports from storage.')
      setReports(DEMO_REPORTS)
    } finally {
      setLoading(false)
    }
  }, [])

  const createReport = useCallback(
    async (params: {
      title: string
      description: string
      category: IssueCategory
      location: string
      priority: IssuePriority
      reporter?: string
    }): Promise<IssueReport> => {
      const saved = svcCreateReport(params)
      setReports((prev) => [saved, ...prev])
      return saved
    },
    []
  )

  const updateStatus = useCallback(
    async (id: string, newStatus: IssueStatus): Promise<boolean> => {
      const updated = updateReportStatus(id, newStatus)
      if (updated) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? updated : r))
        )
        return true
      }
      return false
    },
    []
  )

  const deleteReport = useCallback(
    async (id: string): Promise<boolean> => {
      const ok = svcRemoveReport(id)
      if (ok) {
        setReports((prev) => prev.filter((r) => r.id !== id))
      }
      return ok
    },
    []
  )

  const refresh = useCallback(() => {
    const current = initializeStorage()
    setReports(current)
  }, [])

  const value: ReportsContextValue = {
    reports,
    loading,
    error,
    createReport,
    updateStatus,
    deleteReport,
    refresh,
  }

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
}
