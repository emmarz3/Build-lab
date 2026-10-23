/* ============================================================
   CampusFix — Report Storage (localStorage abstraction)
   ============================================================ */

import type {
  IssueCategory,
  IssuePriority,
  IssueReport,
  IssueStatus,
  ReportActivity,
} from './report.types'
import { STORAGE_KEY, ALL_CATEGORIES, ALL_PRIORITIES, ALL_STATUSES } from './report.constants'

export { STORAGE_KEY }

/** Safe localStorage wrapper that never throws outside this module. */
class LocalStorage {
  private getStorage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null
    } catch {
      return null
    }
  }

  getItem(key: string): string | null {
    const storage = this.getStorage()
    if (!storage) return null
    try {
      return storage.getItem(key)
    } catch {
      return null
    }
  }

  setItem(key: string, value: string): boolean {
    const storage = this.getStorage()
    if (!storage) return false
    try {
      storage.setItem(key, value)
      return true
    } catch {
      return false
    }
  }

  removeItem(key: string): boolean {
    const storage = this.getStorage()
    if (!storage) return false
    try {
      storage.removeItem(key)
      return true
    } catch {
      return false
    }
  }

  get length(): number {
    const storage = this.getStorage()
    if (!storage) return 0
    try {
      return storage.length
    } catch {
      return 0
    }
  }
}

export const safeStorage = new LocalStorage()

/** Type guards for validating parsed storage data. */

function isValidString(val: unknown): val is string {
  return typeof val === 'string' && val.length > 0
}

function isValidDateString(val: unknown): val is string {
  if (!isValidString(val)) return false
  const d = Date.parse(val)
  return !Number.isNaN(d)
}

/**
 * Validate a single stored object and cast it to a proper IssueReport.
 * Returns null if the object is malformed.
 */
export function validateStoredReport(raw: unknown): IssueReport | null {
  if (!raw || typeof raw !== 'object') return null

  const obj = raw as Record<string, unknown>

  if (!isValidString(obj.id)) return null
  if (!isValidString(obj.title)) return null
  if (!isValidString(obj.description)) return null
  if (!isValidString(obj.location)) return null
  if (!isValidString(obj.category)) return null
  if (!ALL_CATEGORIES.includes(obj.category as IssueCategory)) return null
  if (!isValidString(obj.priority)) return null
  if (!ALL_PRIORITIES.includes(obj.priority as IssuePriority)) return null
  if (!isValidString(obj.status)) return null
  if (!ALL_STATUSES.includes(obj.status as IssueStatus)) return null
  if (!isValidDateString(obj.createdAt)) return null
  if (!isValidDateString(obj.updatedAt)) return null

  // Validate activity array
  let activity: ReportActivity[] = []
  if (Array.isArray(obj.activity)) {
    activity = obj.activity
      .map((item): ReportActivity | null => {
        if (!item || typeof item !== 'object') return null
        const a = item as Record<string, unknown>
        if (!isValidString(a.id)) return null
        if (!isValidString(a.timestamp)) return null
        if (!isValidString(a.description)) return null
        if (!isValidString(a.status)) return null
         if (a.status !== 'submitted' && a.status !== 'under-review' && a.status !== 'in-progress' && a.status !== 'resolved') return null
        return {
          id: a.id,
          timestamp: a.timestamp,
          status: a.status as ReportActivity['status'],
          description: a.description,
          performedBy: a.performedBy as string | undefined,
        }
      })
      .filter((item): item is ReportActivity => item !== null)
  }

  return {
    id: obj.id as string,
    title: obj.title as string,
    description: obj.description as string,
    category: obj.category as IssueReport['category'],
    location: obj.location as string,
    priority: obj.priority as IssueReport['priority'],
    status: obj.status as IssueReport['status'],
    createdAt: obj.createdAt as string,
    updatedAt: obj.updatedAt as string,
    reporter: typeof obj.reporter === 'string' ? obj.reporter : undefined,
    activity,
  }
}

/**
 * Load all reports from storage.
 * Returns an empty array if storage is unavailable or data is malformed.
 */
export function loadReports(): IssueReport[] {
  const raw = safeStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(validateStoredReport)
      .filter((report): report is IssueReport => report !== null)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  } catch {
    return []
  }
}

/**
 * Persist the full reports array to storage.
 * Returns true on success, false if storage is unavailable.
 */
export function saveReports(reports: IssueReport[]): boolean {
  try {
    const json = JSON.stringify(reports)
    return safeStorage.setItem(STORAGE_KEY, json)
  } catch {
    return false
  }
}

/**
 * Save a single report — creates or replaces by ID.
 */
export function saveReport(report: IssueReport): IssueReport {
  const reports = loadReports()
  const existing = reports.find((r) => r.id === report.id)
  if (existing) {
    const updated = reports.map((r) => (r.id === report.id ? report : r))
    saveReports(updated)
  } else {
    saveReports([report, ...reports])
  }
  return report
}

/**
 * Delete a report by ID.
 * Returns true if a report was removed.
 */
export function deleteReport(id: string): boolean {
  const reports = loadReports()
  const filtered = reports.filter((r) => r.id !== id)
  if (filtered.length === reports.length) return false
  return saveReports(filtered)
}

/** Check whether storage is available at all. */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__campusix_storage_test__'
    safeStorage.setItem(testKey, '1')
    const ok = safeStorage.getItem(testKey) === '1'
    safeStorage.removeItem(testKey)
    return ok
  } catch {
    return false
  }
}
