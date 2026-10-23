import { describe, expect, it } from 'vitest'
import { DEMO_REPORTS } from './demo-data'
import { filterReports, createDefaultFilters } from './report.selectors'

describe('report.selectors', () => {
  const first = DEMO_REPORTS[0]!

  it('search returns matching reports', () => {
    const term = first.title.split(' ')[0] ?? ''
    const filters = { ...createDefaultFilters(), search: term }
    const result = filterReports(DEMO_REPORTS, filters)
    expect(result.length).toBeGreaterThan(0)
    const lower = term.toLowerCase()
    expect(result.every((r) => r.title.toLowerCase().includes(lower))).toBe(true)
  })

  it('multiple filters produce the correct subset', () => {
    const filters = { ...createDefaultFilters(), categories: [first.category], statuses: [first.status] }
    const result = filterReports(DEMO_REPORTS, filters)
    expect(result.every((r) => r.category === first.category && r.status === first.status)).toBe(true)
  })

  it('reset filters restores expected results', () => {
    const filters = { ...createDefaultFilters(), search: 'zzzz-no-match' }
    const filtered = filterReports(DEMO_REPORTS, filters)
    const reset = filterReports(DEMO_REPORTS, createDefaultFilters())
    expect(filtered.length).toBe(0)
    expect(reset.length).toBe(DEMO_REPORTS.length)
  })
})
