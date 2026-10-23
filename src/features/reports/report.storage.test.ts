import { afterEach, describe, expect, it } from 'vitest'
import {
  loadReports,
  saveReports,
  saveReport,
  deleteReport,
  validateStoredReport,
  isStorageAvailable,
  safeStorage,
  STORAGE_KEY,
} from './report.storage'
import type { IssueReport } from './report.types'
import { DEMO_REPORTS } from './demo-data'

function aReport(overrides: Partial<IssueReport> = {}): IssueReport {
  return {
    id: `report_${Math.random().toString(36).slice(2)}`,
    title: 'Broken chair in Lecture Hall A',
    description: 'The seat is loose and wobbles when sat on.',
    category: 'classroom-equipment',
    location: 'Science Building, Lecture Hall A',
    priority: 'medium',
    status: 'submitted',
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-15T09:00:00.000Z',
    activity: [
      {
        id: 'act_a',
        timestamp: '2026-10-15T09:00:00.000Z',
        status: 'submitted',
        description: 'Report created.',
        performedBy: 'Student',
      },
    ],
    ...overrides,
  }
}

describe('report.storage', () => {
  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY)
  })

  it('loadReports returns an empty array when nothing is stored', () => {
    expect(loadReports()).toEqual([])
  })

  it('isStorageAvailable reports true in the browser environment', () => {
    expect(isStorageAvailable()).toBe(true)
  })

  it('validateStoredReport rejects null and non-objects', () => {
    expect(validateStoredReport(null)).toBeNull()
    expect(validateStoredReport('not an object')).toBeNull()
    expect(validateStoredReport(42)).toBeNull()
    expect(validateStoredReport(undefined)).toBeNull()
  })

  it('validateStoredReport rejects reports missing required fields', () => {
    const base = aReport()
    expect(validateStoredReport({ ...base, id: undefined })).toBeNull()
    expect(validateStoredReport({ ...base, title: '' })).toBeNull()
    expect(validateStoredReport({ ...base, status: 'not-a-status' })).toBeNull()
    expect(validateStoredReport({ ...base, createdAt: 'not-a-date' })).toBeNull()
  })

  it('validateStoredReport keeps valid optional fields', () => {
    const valid = validateStoredReport(aReport({ reporter: 'Patel' }))
    expect(valid?.reporter).toBe('Patel')
  })

  it('saveReports and loadReports persist and round-trip reports', () => {
    const reports = [aReport({ id: 'report_alpha' }), aReport({ id: 'report_beta' })]
    expect(saveReports(reports)).toBe(true)

    const loaded = loadReports()
    expect(loaded.length).toBe(2)
    expect(loaded.map((r) => r.id).sort()).toEqual(['report_alpha', 'report_beta'])
  })

  it('saveReport creates or replaces a report by id', () => {
    const existing = aReport({ id: 'report_existing', title: 'Old title' })
    saveReports([existing])

    const updated = saveReport(aReport({ id: 'report_existing', title: 'New title' }))
    expect(updated.title).toBe('New title')

    const loaded = loadReports()
    expect(loaded.length).toBe(1)
    expect(loaded[0]).toBeDefined()
    expect(loaded[0]?.title).toBe('New title')
  })

  it('deleteReport removes a report and returns true', () => {
    const reports = [aReport({ id: 'report_del' }), aReport({ id: 'report_keep' })]
    saveReports(reports)

    expect(deleteReport('report_del')).toBe(true)
    expect(loadReports().map((r) => r.id)).toEqual(['report_keep'])
    expect(deleteReport('report_missing')).toBe(false)
  })

  it('malformed storage is handled safely and returns an empty list', () => {
    safeStorage.removeItem(STORAGE_KEY)
    safeStorage.setItem(STORAGE_KEY, 'not json at all')
    expect(loadReports()).toEqual([])
    safeStorage.removeItem(STORAGE_KEY)

    safeStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 123 }, 'garbage']))
    expect(loadReports()).toEqual([])
    safeStorage.removeItem(STORAGE_KEY)
  })

  it('DEMO_REPORTS seed data passes storage validation', () => {
    const valid = DEMO_REPORTS.map(validateStoredReport)
    expect(valid.every((r) => r !== null)).toBe(true)
  })
})
