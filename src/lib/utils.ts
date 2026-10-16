/* ============================================================
   CampusFix — Utility Helpers
   ============================================================ */

/**
 * Merge and deduplicate className strings.
 * Handles falsy values and arrays.
 */
export function cn(
  ...classNames: Array<string | false | null | undefined | 0>
): string {
  return classNames.filter(Boolean).join(' ')
}

/**
 * Format a date string into a human-readable string.
 * e.g. "Oct 16, 2026 at 2:30 PM"
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString)
    if (Number.isNaN(d.getTime())) return dateString
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return dateString
  }
}

/**
 * Format a date string as relative (e.g. "2 hours ago").
 * Falls back to formatted date for very old timestamps.
 */
export function formatDateRelative(dateString: string): string {
  try {
    const d = new Date(dateString)
    if (Number.isNaN(d.getTime())) return dateString
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Truncate a string to a max length, appending an ellipsis.
 * Returns the original string if it's at or under the limit.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1).trimEnd() + '…'
}
