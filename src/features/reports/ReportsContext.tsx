/* ============================================================
   CampusFix — Reports Context (Global State)
   Single source of truth for all report data, backed by mock HTTP API.
   ============================================================ */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { IssueReport, IssueStatus, IssueCategory, IssuePriority } from './report.types'
import {
  fetchIssues,
  createIssue as apiCreate,
  updateIssueStatus as apiUpdateStatus,
  deleteIssue as apiDelete,
} from '@/services/issueApi'

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
  refresh: () => Promise<void>
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined)

export function useReports() {
  const ctx = useContext(ReportsContext)
  if (!ctx) {
    throw new Error('useReports must be used within a ReportsProvider')
  }
  return ctx
}

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<IssueReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchIssues()
      setReports(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reports.')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const createReport = useCallback(
    async (params: {
      title: string
      description: string
      category: IssueCategory
      location: string
      priority: IssuePriority
      reporter?: string
    }): Promise<IssueReport> => {
      const saved = await apiCreate(params)
      setReports((prev) => [saved, ...prev])
      return saved
    },
    []
  )

  const updateStatus = useCallback(
    async (id: string, newStatus: IssueStatus): Promise<boolean> => {
      try {
        const updated = await apiUpdateStatus(id, newStatus)
        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)))
        return true
      } catch {
        return false
      }
    },
    []
  )

  const deleteReport = useCallback(async (id: string): Promise<boolean> => {
    try {
      const ok = await apiDelete(id)
      if (ok) setReports((prev) => prev.filter((r) => r.id !== id))
      return ok
    } catch {
      return false
    }
  }, [])

  const refresh = useCallback(async () => {
    await load()
  }, [load])

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
