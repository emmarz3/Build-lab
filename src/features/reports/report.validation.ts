/* ============================================================
   CampusFix — Report Validation
   ============================================================ */

import type { IssueCategory, IssuePriority, IssueStatus } from './report.types'
import {
  ALL_CATEGORIES,
  ALL_PRIORITIES,
  ALL_STATUSES,
  FIELD_LIMITS,
} from './report.constants'

/** A single validation error. */
export interface ValidationError {
  field: string
  message: string
}

/** Result of validating a report form submission. */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/** Trim a string and collapse internal whitespace to single spaces. */
export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

/** Validate a raw title. */
export function validateTitle(value: string | undefined): string | null {
  if (value === undefined || value === null) {
    return 'Title is required.'
  }
  const trimmed = normalizeText(value)
  if (trimmed.length === 0) {
    return 'Title is required.'
  }
  if (trimmed.length > FIELD_LIMITS.title) {
    return `Title must be ${FIELD_LIMITS.title} characters or fewer.`
  }
  return null
}

/** Validate a raw description. */
export function validateDescription(value: string | undefined): string | null {
  if (value === undefined || value === null) {
    return 'Description is required.'
  }
  const trimmed = normalizeText(value)
  if (trimmed.length === 0) {
    return 'Description is required.'
  }
  if (trimmed.length > FIELD_LIMITS.description) {
    return `Description must be ${FIELD_LIMITS.description} characters or fewer.`
  }
  return null
}

/** Validate a location. */
export function validateLocation(value: string | undefined): string | null {
  if (value === undefined || value === null) {
    return 'Location is required.'
  }
  const trimmed = normalizeText(value)
  if (trimmed.length === 0) {
    return 'Location is required.'
  }
  if (trimmed.length > FIELD_LIMITS.location) {
    return `Location must be ${FIELD_LIMITS.location} characters or fewer.`
  }
  return null
}

/** Validate a category value. */
export function validateCategory(value: string | undefined): string | null {
  if (value === undefined || !ALL_CATEGORIES.includes(value as IssueCategory)) {
    return 'Please select a valid category.'
  }
  return null
}

/** Validate a priority value. */
export function validatePriority(value: string | undefined): string | null {
  if (value === undefined || !ALL_PRIORITIES.includes(value as IssuePriority)) {
    return 'Please select a valid priority.'
  }
  return null
}

/** Validate a status value. */
export function validateStatus(value: string | undefined): string | null {
  if (value === undefined || !ALL_STATUSES.includes(value as IssueStatus)) {
    return 'Please select a valid status.'
  }
  return null
}

/**
 * Validate a full report form submission.
 * Returns a ValidationResult with all field errors.
 */
export interface ReportFormValues {
  title: string
  description: string
  category: string
  location: string
  priority: string
}

export function validateReportForm(values: ReportFormValues): ValidationResult {
  const errors: ValidationError[] = []

  const titleErr = validateTitle(values.title)
  if (titleErr) errors.push({ field: 'title', message: titleErr })

  const descriptionErr = validateDescription(values.description)
  if (descriptionErr) errors.push({ field: 'description', message: descriptionErr })

  const categoryErr = validateCategory(values.category)
  if (categoryErr) errors.push({ field: 'category', message: categoryErr })

  const locationErr = validateLocation(values.location)
  if (locationErr) errors.push({ field: 'location', message: locationErr })

  const priorityErr = validatePriority(values.priority)
  if (priorityErr) errors.push({ field: 'priority', message: priorityErr })

  return { valid: errors.length === 0, errors }
}

/** Convert a ValidationError[] into a field-keyed map for form use. */
export function errorsToMap(
  errors: ValidationError[]
): Record<string, string> {
  const map: Record<string, string> = {}
  for (const err of errors) {
    map[err.field] = err.message
  }
  return map
}
