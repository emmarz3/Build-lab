/* ============================================================
   CampusFix — Report Constants
   All runtime constant values (labels, orders, configs).
   ============================================================ */

import type {
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from './report.types'

/** Storage key for persisted reports. */
export const STORAGE_KEY = 'campusfix-reports-v1'

/** Maximum lengths enforced by the form and validated. */
export const FIELD_LIMITS = {
  title: 120,
  description: 2000,
  location: 150,
} as const

/** Maximum file size for photo uploads: 5 MB. */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024

/** Allowed photo MIME types. */
export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

/** Allowed photo file extensions (for display / validation). */
export const ALLOWED_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

/** Priority ordering — higher index = higher priority. */
export const PRIORITY_RANK: Record<IssuePriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
}

/** Status ordering for workflow progression. */
export const STATUS_ORDER: IssueStatus[] = [
  'submitted',
  'under-review',
  'in-progress',
  'resolved',
]

/** Statuses that represent an "open" (not resolved) report. */
export const OPEN_STATUSES: IssueStatus[] = ['submitted', 'under-review', 'in-progress']

/** All categories in display order. */
export const ALL_CATEGORIES: IssueCategory[] = [
  'classroom-equipment',
  'electrical',
  'plumbing',
  'cleaning-waste',
  'buildings-facilities',
  'other',
]

/** All priorities in display order (low → high). */
export const ALL_PRIORITIES: IssuePriority[] = ['low', 'medium', 'high']

/** All statuses in workflow order. */
export const ALL_STATUSES: IssueStatus[] = STATUS_ORDER

/** Label maps */
export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  'classroom-equipment': 'Classroom Equipment',
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  'cleaning-waste': 'Cleaning and Waste',
  'buildings-facilities': 'Buildings and Facilities',
  other: 'Other',
}

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
  submitted: 'Submitted',
  'under-review': 'Under Review',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
}

/** Category icon mapping (Lucide icon name). */
export const CATEGORY_ICONS: Record<IssueCategory, string> = {
  'classroom-equipment': 'Projector',
  electrical: 'Zap',
  plumbing: 'Droplets',
  'cleaning-waste': 'Trash2',
  'buildings-facilities': 'Building2',
  other: 'CircleHelp',
}

/** Status icon mapping (Lucide icon name). */
export const STATUS_ICONS: Record<IssueStatus, string> = {
  submitted: 'Clock',
  'under-review': 'Eye',
  'in-progress': 'Wrench',
  resolved: 'CheckCircle2',
}

/** Priority icon mapping (Lucide icon name). */
export const PRIORITY_ICONS: Record<IssuePriority, string> = {
  low: 'ArrowDown',
  medium: 'ArrowRight',
  high: 'ArrowUp',
}

/**
 * Returns the next valid statuses that a report can transition to
 * from the given current status.
 */
export function getNextStatuses(current: IssueStatus): IssueStatus[] {
  const idx = STATUS_ORDER.indexOf(current)
  if (idx === -1 || idx === STATUS_ORDER.length - 1) {
    return []
  }
  return STATUS_ORDER.slice(idx + 1)
}
