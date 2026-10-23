# CampusFix — Component Map

## Layout
- `AppShell` — header/main/footer wrapper.
- `Header` / `Footer` / `Logo` — branding and navigation chrome.
- `PageHeader` — title, description, action slot.
- `Navigation` (nav-config) — nav items and report action.

## Reports
- `ReportCard` — issue card with save toggle.
- `ReportsList` — list with loading/empty/error states.
- `SearchBar` — search input.
- `FilterBar` — category/status/priority filters.

## UI primitives
- `Button`, `LinkButton`, `IconButton`
- `Card`, `Badge`, `StatusBadge`
- `Input`, `Select`, `Textarea`
- `EmptyState`, `Skeleton`
- `PageTransition`

## Pages
- `LandingPage`, `ReportsPage`, `NewReportPage`, `ReportDetailPage`, `DashboardPage`, `NotFoundPage`.

## Features
- `ReportsContext` — global report state backed by mock API.
- `report.service` / `issueApi` — data access.
- `report.selectors` — pure filtering/search/sort/count.
- `report.validation` — form validation.
- `report.storage` — localStorage abstraction.
- `Toast` — notification provider.
- `useSavedIssues` — saved-state hook.
