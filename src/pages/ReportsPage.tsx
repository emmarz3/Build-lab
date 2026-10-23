/* ============================================================
   CampusFix — Reports Page
   Landing page for all reports: search, filter, sort, and list.
   ============================================================ */

import { useState, useMemo } from 'react'
import { useReports } from '@/features/reports/ReportsContext'
import {
  filterReports,
  sortReports,
  createDefaultFilters,
} from '@/features/reports/report.selectors'
import type { ReportSortKey } from '@/features/reports/report.selectors'
import type { ReportFilters } from '@/features/reports/report.types'
import { SearchBar } from '@/components/reports/SearchBar'
import { FilterBar } from '@/components/reports/FilterBar'
import { ReportsList } from '@/components/reports/ReportsList'
import { PageHeader } from '@/components/layout/PageHeader'
import { Select } from '@/components/ui/Select'
import { LinkButton } from '@/components/ui/LinkButton'
import { PlusCircle, Filter, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority', label: 'Priority: high to low' },
  { value: 'status', label: 'Status: workflow order' },
] as const

export function ReportsPage() {
  const { reports, loading } = useReports()
  const [filters, setFilters] = useState<ReportFilters>(createDefaultFilters())
  const [sortBy, setSortBy] = useState<ReportSortKey>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const searchTerm = filters.search

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }))
  }

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters(createDefaultFilters())
  }

  const filtered = useMemo(() => {
    return sortReports(filterReports(reports, filters), sortBy)
  }, [reports, filters, sortBy])

  const activeFilterCount =
    filters.categories.length +
    filters.statuses.length +
    filters.priorities.length
  const hasSearch = searchTerm.trim().length > 0

  return (
    <div className="py-6">
      <PageHeader
        title="Issue Reports"
        description={
          reports.length === 1
            ? '1 report on campus'
            : `${reports.length} reports on campus`
        }
        action={
          <LinkButton
            to="/issues/new"
            icon={<PlusCircle className="h-5 w-5" />}
          >
            Report an Issue
          </LinkButton>
        }
      />

      {/* Controls: search + sort + filter toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title, description, location, category..."
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReportSortKey)}
            className="w-56"
            aria-label="Sort reports"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)]',
              'px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)]',
              'hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-text-primary)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]',
              activeFilterCount > 0 && 'text-[var(--color-primary)]'
            )}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span
                className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs font-semibold text-white"
                aria-label={`${activeFilterCount} active filters`}
              >
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                showFilters ? 'rotate-180' : ''
              )}
            />
          </button>
        </div>
      </div>

      {/* Collapsible filter panel */}
      {showFilters && (
        <div
          id="filter-panel"
          className="mb-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4"
        >
          <FilterBar
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>
      )}

      {/* Results: filtered count + list */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {loading
            ? 'Loading reports...'
            : `${filtered.length} report${filtered.length === 1 ? '' : 's'} shown`}
        </p>

        {(hasSearch || activeFilterCount > 0) && !loading && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <ReportsList
        reports={filtered}
        loading={loading}
        emptyTitle={
          hasSearch || activeFilterCount > 0
            ? 'No matching reports'
            : 'No reports yet'
        }
        emptyDescription={
          hasSearch || activeFilterCount > 0
            ? 'Try adjusting your search or filter criteria.'
            : 'Be the first to report an issue on campus.'
        }
      />
    </div>
  )
}
