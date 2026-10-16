/* ============================================================
   CampusFix — Issue Report Type Definitions
   Only type definitions belong here. Constants live in
   report.constants.ts to avoid circular imports.
   ============================================================ */

/** Unique identifier for a report. */
export type ReportId = string

/** All possible issue categories. */
export type IssueCategory =
  | 'classroom-equipment'
  | 'electrical'
  | 'plumbing'
  | 'cleaning-waste'
  | 'buildings-facilities'
  | 'other'

/** All possible priority levels. */
export type IssuePriority = 'low' | 'medium' | 'high'

/** All possible statuses for a report. */
export type IssueStatus =
  | 'submitted'
  | 'under-review'
  | 'in-progress'
  | 'resolved'

/** An activity entry in a report's history. */
export interface ReportActivity {
  id: string
  timestamp: string
  status: IssueStatus
  description: string
  performedBy?: string
}

/** A campus issue report. */
export interface IssueReport {
  id: ReportId
  title: string
  description: string
  category: IssueCategory
  location: string
  priority: IssuePriority
  status: IssueStatus
  createdAt: string
  updatedAt: string
  activity: ReportActivity[]
  reporter?: string
}

/** Filter state for the reports listing. */
export interface ReportFilters {
  search: string
  categories: IssueCategory[]
  statuses: IssueStatus[]
  priorities: IssuePriority[]
}

/** A generic filter option used by UI components. */
export interface FilterOption {
  value: string
  label: string
}
