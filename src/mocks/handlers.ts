/* ============================================================
   CampusFix — MSW Mock API Handlers
   Fictional demonstration data only. Not a real university system.
   ============================================================ */

import { http, HttpResponse } from 'msw'
import type { IssueReport, IssueCategory, IssuePriority } from '@/features/reports/report.types'
import { DEMO_REPORTS } from '@/features/reports/demo-data'
import { STORAGE_KEY } from '@/features/reports/report.constants'

function loadStore(): IssueReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fall through
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_REPORTS))
  return [...DEMO_REPORTS]
}

function saveStore(reports: IssueReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  } catch {
    // ignore
  }
}

let store: IssueReport[] = loadStore()

function nowIso() {
  return new Date().toISOString()
}

function generateId() {
  return `report_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export const handlers = [
  http.get('/api/issues', () => {
    return HttpResponse.json(store)
  }),

  http.get('/api/issues/:id', ({ params }) => {
    const id = String(params.id)
    const report = store.find((r) => r.id === id)
    if (!report) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(report)
  }),

  http.post('/api/issues', async ({ request }) => {
    const body = (await request.json()) as {
      title: string
      description: string
      category: IssueCategory
      location: string
      priority: IssuePriority
      reporter?: string
    }

    const now = nowIso()
    const report: IssueReport = {
      id: generateId(),
      title: (body.title ?? '').trim(),
      description: (body.description ?? '').trim(),
      category: body.category,
      location: (body.location ?? '').trim(),
      priority: body.priority,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
      reporter: body.reporter,
      activity: [
        {
          id: `act_${Date.now().toString(36)}`,
          timestamp: now,
          status: 'submitted',
          description: 'Report created and set to "submitted".',
          performedBy: body.reporter ?? 'System',
        },
      ],
    }

    store = [report, ...store]
    saveStore(store)
    return HttpResponse.json(report, { status: 201 })
  }),

  http.patch('/api/issues/:id', async ({ params, request }) => {
    const id = String(params.id)
    const body = (await request.json()) as { status?: IssueReport['status'] }
    const idx = store.findIndex((r) => r.id === id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const updated: IssueReport = { ...store[idx], ...body, updatedAt: nowIso() } as IssueReport
    store[idx] = updated
    saveStore(store)
    return HttpResponse.json(updated)
  }),

  http.delete('/api/issues/:id', ({ params }) => {
    const id = String(params.id)
    const idx = store.findIndex((r) => r.id === id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    store.splice(idx, 1)
    saveStore(store)
    return new HttpResponse(null, { status: 204 })
  }),
]
