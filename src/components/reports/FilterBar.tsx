/* ============================================================
   CampusFix — FilterBar: Category, Status, Priority, Reset
   ============================================================ */

import type { IssueCategory, IssuePriority, IssueStatus, ReportFilters } from '@/features/reports/report.types'
import { ALL_CATEGORIES, ALL_PRIORITIES, STATUS_ORDER, CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/features/reports/report.constants'
import { cn } from '@/lib/utils'
import { X, Filter } from 'lucide-react'

export interface FilterBarProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
  onReset: () => void
  className?: string
}

interface FilterGroupProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}

function FilterChipGroup({ label, options, selected, onChange }: FilterGroupProps) {
  const toggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value)
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={cn(
                'rounded-[var(--radius-full)] border px-3 py-1.5 text-sm font-medium',
                'transition-all focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]',
                'focus-visible:ring-offset-2',
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary-hover)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-strong)]'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function FilterBar({ filters, onChange, onReset, className }: FilterBarProps) {
  const activeFilterCount =
    filters.categories.length +
    filters.statuses.length +
    filters.priorities.length

  const categoryOptions = ALL_CATEGORIES.map((c) => ({
    value: c,
    label: CATEGORY_LABELS[c],
  }))

  const statusOptions = STATUS_ORDER.map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  }))

  const priorityOptions = ALL_PRIORITIES.map((p) => ({
    value: p,
    label: PRIORITY_LABELS[p],
  }))

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="rounded-full bg-[var(--color-primary-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary)]"
              aria-label={`${activeFilterCount} active filters`}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:underline"
            aria-label="Reset all filters"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      <FilterChipGroup
        label="Category"
        options={categoryOptions}
        selected={filters.categories as string[]}
        onChange={(vals) => onChange({ ...filters, categories: vals as IssueCategory[] })}
      />
      <FilterChipGroup
        label="Status"
        options={statusOptions}
        selected={filters.statuses as string[]}
        onChange={(vals) => onChange({ ...filters, statuses: vals as IssueStatus[] })}
      />
      <FilterChipGroup
        label="Priority"
        options={priorityOptions}
        selected={filters.priorities as string[]}
        onChange={(vals) => onChange({ ...filters, priorities: vals as IssuePriority[] })}
      />
    </div>
  )
}
