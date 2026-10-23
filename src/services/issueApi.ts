/* ============================================================
   CampusFix — Issue API (mock HTTP layer via MSW)
   ============================================================ */

import type { IssueReport, IssueCategory, IssuePriority, IssueStatus } from '@/features/reports/report.types'

const BASE = '/api/issues'

export async function fetchIssues(): Promise<IssueReport[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error(`Failed to load issues (${res.status})`)
  return res.json()
}

export async function fetchIssue(id: string): Promise<IssueReport> {
  const res = await fetch(`${BASE}/${id}`)
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error(`Failed to load issue (${res.status})`)
  return res.json()
}

export async function createIssue(params: {
  title: string
  description: string
  category: IssueCategory
  location: string
  priority: IssuePriority
  reporter?: string
}): Promise<IssueReport> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!res.ok) throw new Error(`Failed to create issue (${res.status})`)
  return res.json()
}

export async function updateIssueStatus(id: string, status: IssueStatus): Promise<IssueReport> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`Failed to update issue (${res.status})`)
  return res.json()
}

export async function deleteIssue(id: string): Promise<boolean> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (res.status === 404) return false
  if (!res.ok) throw new Error(`Failed to delete issue (${res.status})`)
  return true
}
