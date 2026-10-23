/* ============================================================
   CampusFix — Saved Issues (localStorage)
   ============================================================ */

import { useState, useEffect, useCallback } from 'react'

const KEY = 'campusfix-saved-issues-v1'

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === 'string')
  } catch {
    // malformed
  }
  return []
}

export function useSavedIssues() {
  const [saved, setSaved] = useState<string[]>(() => readSaved())

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved))
    } catch {
      // ignore
    }
  }, [saved])

  const isSaved = useCallback((id: string) => saved.includes(id), [saved])

  const toggle = useCallback((id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const remove = useCallback((id: string) => {
    setSaved((prev) => prev.filter((x) => x !== id))
  }, [])

  return { saved, isSaved, toggle, remove }
}
