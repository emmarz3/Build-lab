/* ============================================================
   CampusFix — Report Selectors
   Pure functions for filtering, searching, and counting reports.
   No React dependency — pure logic for testability.
   ============================================================ */

import type { IssueReport, IssuePriority, ReportFilters } from './report.types'
import { STATUS_ORDER, OPEN_STATUSES } from './report.constants'

/**
 * A single report matches the search query.
 * Matches against title, description, location (case-insensitive substring).
 */
export function matchesSearch(report: IssueReport, query: string): boolean {
  const term = query.trim().toLowerCase()
  if (term.length === 0) return true

  const searchable = [
    report.title,
    report.description,
    report.location,
    report.category,
    report.status,
    report.priority,
  ].join(' ')

  return searchable.toLowerCase().includes(term)
}

/**
 * A report matches all active filters.
 * Filters work together (AND logic).
 */
export function matchesFilters(report: IssueReport, filters: ReportFilters): boolean {
  const searchOk = matchesSearch(report, filters.search)
  const categoryOk =
    filters.categories.length === 0 || filters.categories.includes(report.category)
  const statusOk =
    filters.statuses.length === 0 || filters.statuses.includes(report.status)
  const priorityOk =
    filters.priorities.length === 0 || filters.priorities.includes(report.priority)

  return searchOk && categoryOk && statusOk && priorityOk
}

/**
 * Apply filters to a list of reports and return the matching subset.
 * Does not mutate the input array.
 */
export function filterReports(
  reports: IssueReport[],
  filters: ReportFilters
): IssueReport[] {
  return reports.filter((r) => matchesFilters(r, filters))
}

/**
 * Sort reports by a given criterion.
 * - 'newest'  — most recently created first
 * - 'oldest'  — oldest first
 * - 'priority' — highest priority first, then newest
 * - 'status'   — by workflow order (submitted → resolved), then newest
 */
export type ReportSortKey = 'newest' | 'oldest' | 'priority' | 'status'

export function sortReports(
  reports: IssueReport[],
  sortBy: ReportSortKey
): IssueReport[] {
  const sorted = [...reports]
  switch (sortBy) {
    case 'newest':
      sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      break
    case 'oldest':
      sorted.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
      break
    case 'priority':
      sorted.sort((a, b) => {
        // Higher priority first, then newest
        const pa = PRIORITY_RANK[a.priority]
        const pb = PRIORITY_RANK[b.priority]
        if (pa !== pb) return pb - pa
        return Date.parse(b.createdAt) - Date.parse(a.createdAt)
      })
      break
    case 'status':
      sorted.sort((a, b) => {
        const sa = STATUS_ORDER.indexOf(a.status)
        const sb = STATUS_ORDER.indexOf(b.status)
        if (sa !== sb) return sa - sb
        return Date.parse(b.createdAt) - Date.parse(a.createdAt)
      })
      break
  }
  return sorted
}

// Priority rank lookup (imported lazily to avoid circular imports)
const PRIORITY_RANK: Record<IssuePriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
}

/**
 * Count reports grouped by status.
 */
export function countByStatus(reports: IssueReport[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const r of reports) {
    counts[r.status] = (counts[r.status] ?? 0) + 1
  }
  return counts
}

/**
 * Count reports grouped by category.
 */
export function countByCategory(reports: IssueReport[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const r of reports) {
    counts[r.category] = (counts[r.category] ?? 0) + 1
  }
  return counts
}

/**
 * Count reports grouped by priority.
 */
export function countByPriority(reports: IssueReport[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const r of reports) {
    counts[r.priority] = (counts[r.priority] ?? 0) + 1
  }
  return counts
}

/** Count of reports that are still open (not resolved). */
export function countOpenReports(reports: IssueReport[]): number {
  return reports.filter((r) => !r.status.includes('resolved')).length
}

/** Count of "open" reports in progress. */
export function countInProgress(reports: IssueReport[]): number {
  return reports.filter((r) => r.status === 'in-progress').length
}

/** Count of resolved reports. */
export function countResolved(reports: IssueReport[]): number {
  return reports.filter((r) => r.status === 'resolved').length
}

/**
 * Return the default (empty) filter set.
 */
export function createDefaultFilters(): ReportFilters {
  return {
    search: '',
    categories: [],
    statuses: [],
    priorities: [],
  }
}

/**
 * Check whether a filters object has any active filters.
 */
export function hasActiveFilters(filters: ReportFilters): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.categories.length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0
  )
}

/** Re-export for convenience. */
export { OPEN_STATUSES, STATUS_ORDER }
