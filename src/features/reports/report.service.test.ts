import { afterEach, describe, expect, it } from 'vitest'
import {
  createReport,
  updateReportStatus,
  removeReport,
  getReport,
  getAllReports,
} from './report.service'
import { safeStorage, STORAGE_KEY } from './report.storage'

const params = {
  title: 'Flickering light in corridor',
  description: 'The overhead light in the west corridor flickers constantly.',
  category: 'electrical' as const,
  location: 'West corridor, near the library',
  priority: 'high' as const,
  reporter: 'Jordan Lee',
}

describe('report.service', () => {
  afterEach(() => {
    safeStorage.removeItem(STORAGE_KEY)
  })

  it('createReport persists a report with an id, timestamps, and initial activity', () => {
    const report = createReport(params)
    const firstActivity = report.activity[0]

    expect(report.id).toMatch(/^report_/)
    expect(report.title).toBe('Flickering light in corridor')
    expect(report.status).toBe('submitted')
    expect(report.createdAt).toBe(report.updatedAt)
    expect(report.activity.length).toBe(1)
    expect(firstActivity).toBeDefined()
    expect(firstActivity?.status).toBe('submitted')
    expect(firstActivity?.performedBy).toBe('Jordan Lee')

    const loaded = getReport(report.id)
    expect(loaded).not.toBeNull()
    if (!loaded) throw new Error('Expected report to be persisted')
    expect(loaded.title).toBe(report.title)
  })

  it('updateReportStatus changes status, records activity, and bumps updatedAt', async () => {
    const report = createReport(params)
    const before = report.updatedAt

    await new Promise((resolve) => setTimeout(resolve, 10))

    const updated = updateReportStatus(report.id, 'in-progress', 'Maintenance Team')
    expect(updated).not.toBeNull()
    if (!updated) throw new Error('Expected updated report')
    expect(updated.status).toBe('in-progress')
    expect(updated.updatedAt).not.toBe(before)
    expect(updated.activity.length).toBe(2)
    expect(updated.activity[1]?.status).toBe('in-progress')
    expect(updated.activity[1]?.performedBy).toBe('Maintenance Team')

    const reloaded = getReport(report.id)
    expect(reloaded).not.toBeNull()
    if (!reloaded) throw new Error('Expected reloaded report')
    expect(reloaded.status).toBe('in-progress')
    expect(reloaded.activity.length).toBe(2)
  })

  it('updateReportStatus returns null for an unknown report id', () => {
    expect(updateReportStatus('report_does_not_exist', 'resolved')).toBeNull()
  })

  it('removeReport deletes a report and persists the change', () => {
    const report = createReport(params)
    expect(getAllReports().length).toBeGreaterThanOrEqual(1)

    expect(removeReport(report.id)).toBe(true)
    expect(getReport(report.id)).toBeNull()

    expect(removeReport(report.id)).toBe(false)
  })
})
