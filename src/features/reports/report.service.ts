/* ============================================================
   CampusFix — Report Service
   Business logic: create, update status, delete.
   Uses the storage abstraction as the single source of truth.
   ============================================================ */

import type {
  IssueReport,
  IssueCategory,
  IssuePriority,
  IssueStatus,
  ReportActivity,
} from './report.types'
import { STORAGE_KEY } from './report.constants'
import { loadReports, saveReports, saveReport as storageSaveReport } from './report.storage'
import { STATUS_ORDER } from './report.constants'

/** Generate a unique report ID. */
function generateId(): string {
  return `report_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

/** Generate a unique activity ID. */
function generateActivityId(): string {
  return `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

/** Current ISO timestamp string. */
function nowIso(): string {
  return new Date().toISOString()
}

/** Build the initial activity entry for a new report. */
function buildInitialActivity(
  status: IssueStatus,
  reporter?: string
): ReportActivity[] {
  return [
    {
      id: generateActivityId(),
      timestamp: nowIso(),
      status,
      description: `Report created and set to "${status}".`,
      performedBy: reporter ?? 'System',
    },
  ]
}

/**
 * Create a new issue report.
 * Persists immediately and returns the created report.
 */
export function createReport(params: {
  title: string
  description: string
  category: IssueCategory
  location: string
  priority: IssuePriority
  reporter?: string
}): IssueReport {
  const now = nowIso()
  const report: IssueReport = {
    id: generateId(),
    title: params.title.trim(),
    description: params.description.trim(),
    category: params.category,
    location: params.location.trim(),
    priority: params.priority,
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
    reporter: params.reporter,
    activity: buildInitialActivity('submitted', params.reporter),
  }

  storageSaveReport(report)
  return report
}

/**
 * Update the status of a report.
 * Records an activity entry and bumps updatedAt.
 * Returns the updated report, or null if not found.
 */
export function updateReportStatus(
  id: string,
  newStatus: IssueStatus,
  performedBy: string = 'Operations Staff'
): IssueReport | null {
  const reports = loadReports()
  const report = reports.find((r) => r.id === id)
  if (!report) return null

  const now = nowIso()
  const updatedReport: IssueReport = {
    ...report,
    status: newStatus,
    updatedAt: now,
    activity: [
      ...report.activity,
      {
        id: generateActivityId(),
        timestamp: now,
        status: newStatus,
        description: `Status updated to "${STATUS_ORDER.includes(newStatus) ? newStatus : 'resolved'}".`,
        performedBy,
      },
    ],
  }

  // Replace in storage
  const updated = reports.map((r) => (r.id === id ? updatedReport : r))
  saveReports(updated)
  return updatedReport
}

/**
 * Update the next sequential status of a report.
 * "Advance" moves to the next status in the workflow.
 * Returns the new status, or null if already resolved / not found.
 */
export function advanceStatus(id: string): IssueStatus | null {
  const reports = loadReports()
  const report = reports.find((r) => r.id === id)
  if (!report) return null

  const currentIdx = STATUS_ORDER.indexOf(report.status)
  if (currentIdx === -1 || currentIdx === STATUS_ORDER.length - 1) return null

  const nextStatus = STATUS_ORDER[currentIdx + 1] as IssueStatus
  const updated = updateReportStatus(id, nextStatus)
  return updated ? updated.status : null
}

/**
 * Delete a report by ID.
 * Returns true if a report was deleted.
 */
export function removeReport(id: string): boolean {
  const reports = loadReports()
  const filtered = reports.filter((r) => r.id !== id)
  if (filtered.length === reports.length) return false
  return saveReports(filtered)
}

/**
 * Get all reports from storage.
 */
export function getAllReports(): IssueReport[] {
  return loadReports()
}

/**
 * Find a single report by ID.
 */
export function getReport(id: string): IssueReport | null {
  return loadReports().find((r) => r.id === id) ?? null
}

/** Storage key, re-exported for external use. */
export { STORAGE_KEY }
