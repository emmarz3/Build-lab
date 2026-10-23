import { describe, expect, it } from 'vitest'
import { validateReportForm, validateTitle, validateDescription } from './report.validation'
import { FIELD_LIMITS } from './report.constants'

const valid = {
  title: 'Broken window latch',
  description: 'The window in Room 101 will not latch shut.',
  category: 'classroom-equipment',
  location: 'Arts Building, Room 101',
  priority: 'medium',
}

describe('report.validation', () => {
  it('accepts a fully valid report form', () => {
    const result = validateReportForm(valid)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects required fields that are empty or whitespace-only', () => {
    expect(validateReportForm({ ...valid, title: '   ' }).valid).toBe(false)
    expect(validateReportForm({ ...valid, description: '\t\n' }).valid).toBe(false)
    expect(validateReportForm({ ...valid, location: '' }).valid).toBe(false)
    expect(validateReportForm({ ...valid, category: '' }).valid).toBe(false)
    expect(validateReportForm({ ...valid, priority: '' }).valid).toBe(false)
  })

  it('enforces maximum lengths for unusually long input', () => {
    const longTitle = 'A'.repeat(FIELD_LIMITS.title + 1)
    const longDescription = 'B'.repeat(FIELD_LIMITS.description + 1)
    const longLocation = 'C'.repeat(FIELD_LIMITS.location + 1)

    expect(validateTitle(longTitle)).toContain(String(FIELD_LIMITS.title))
    expect(validateDescription(longDescription)).toContain(String(FIELD_LIMITS.description))
    expect(
      validateReportForm({ ...valid, title: longTitle }).valid
    ).toBe(false)
    expect(
      validateReportForm({ ...valid, description: longDescription }).valid
    ).toBe(false)
    expect(
      validateReportForm({ ...valid, location: longLocation }).valid
    ).toBe(false)
  })

  it('returns an error for every invalid field', () => {
    const result = validateReportForm({
      ...valid,
      title: '',
      category: 'not-a-category',
      priority: 'urgent',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.map((e) => e.field).sort()).toEqual([
      'category',
      'priority',
      'title',
    ])
  })
})
