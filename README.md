# CampusFix

> A campus issue reporting and tracking platform — report, triage, and resolve
> facilities, equipment, and maintenance issues across a campus.

CampusFix is a single-page web application that lets students, staff, and
operations teams **submit**, **track**, and **resolve** campus issues (broken
projectors, electrical faults, plumbing leaks, cleaning requests, building
damage, and more). Reports move through a clear workflow —
*Submitted → Under Review → In Progress → Resolved* — with a full activity
history, so everyone can see what is happening and when.

This repository is the working codebase for the **BuildLab Stage 1 Frontend
Development** programme. It is built incrementally across three weeks (see
[Progress](#progress)).

This is a **demonstration using mock data**. It is not connected to a real
university maintenance system or backend.

---

## Problem and target user

**Problem:** Students may encounter broken classroom equipment, damaged furniture,
plumbing faults, poor campus connectivity and other facility issues without a
convenient, transparent interface for documenting problems and tracking their
status.

**Target user:** A university student who needs to report and follow the status
of campus maintenance problems.

---

## Key features

- Issue listing with search, filter (category/status/priority), sort, and list view.
- Issue detail with full information, status management, and activity history.
- New report form with validation and toast feedback.
- Operations dashboard with summary stats and breakdowns.
- Saved issues persisted to localStorage.
- Loading, empty, error, and retry states.
- Responsive, accessible UI with reduced-motion support.

---

## Technology stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 + CSS design tokens |
| Icons | lucide-react |
| Mock API | MSW (Mock Service Worker) |
| Testing | Vitest + Testing Library (happy-dom) |
| Linting | oxlint |

---

## Project architecture

```
src/
├── app/            # router
├── components/     # layout, reports, ui primitives
├── features/       # domain: reports (types, constants, service, storage, selectors, validation, context), ui (toast)
├── hooks/          # useSavedIssues
├── mocks/          # MSW handlers + browser worker
├── services/       # issueApi (fetch wrappers)
├── pages/          # route-level pages
├── styles/         # global.css, tokens.css
└── test/           # setup
```

Business logic, data access, presentation, and routing are separated. Selectors
are pure functions for testability. Storage is wrapped in a never-throwing
abstraction.

---

## Component map

See `docs/component-map.md` for the full map. Major components: `AppShell`,
`Header`/`Footer`, `PageHeader`, `ReportCard`, `ReportsList`, `SearchBar`,
`FilterBar`, `StatusBadge`/`PriorityBadge`/`CategoryBadge`, `Button`,
`LinkButton`, `Card`, `EmptyState`, `Skeleton`, `PageTransition`,
`ReportsContext`.

---

## Data source and mock API

CampusFix uses **MSW** to provide a mock HTTP API so the deployed frontend can
demonstrate data integration without a real backend.

Endpoints:

- `GET /api/issues` — list all issues.
- `GET /api/issues/:id` — get one issue (404 if missing).
- `POST /api/issues` — submit a new issue.
- `PATCH /api/issues/:id` — update status.
- `DELETE /api/issues/:id` — delete an issue.

Data is fictional demonstration data. The mock API persists to `localStorage`
where available; persistence has limitations in private/incognito or restricted
environments. This is **not** a real university maintenance system.

---

## Setup and installation

```bash
git clone https://github.com/emmarz3/Build-lab.git
cd Build-lab
npm install
npm run dev
```

Open http://localhost:5173.

## Development commands

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check then production build |
| `npm run lint` | Run oxlint |
| `npm run test` | Run Vitest suite once |
| `npm run preview` | Preview production build |

## Test commands

```bash
npm run test
```

Current suite: **21 tests** across `report.selectors`, `report.service`,
`report.storage`, and `report.validation` — all passing.

---

## Deployment

Deployed via Vercel (static hosting). Ensure SPA fallback is configured so
nested routes (`/issues/:id`) work on refresh. MSW service worker must be
served from `public/` (copied via `msw init`).

Verified live URL: not deployed — Vercel credentials unavailable in this environment.

---

## Accessibility

- Semantic HTML, associated labels, visible focus rings.
- Heading hierarchy, alt text where applicable.
- Reduced-motion support via `PageTransition` and CSS.
- Contrast targets WCAG 2.2 AA (4.5:1 for normal text).

**Audit:** Lighthouse/axe not available in this environment; manual verification
performed for keyboard navigation, focus visibility, labels, heading structure,
contrast, and mobile usability. See `docs/issue-log.md`.

---

## Important technical decisions

- Feature-based folder structure; pure selectors for testability.
- MSW over a real backend to keep the app frontend-focused and deployable.
- localStorage for persistence with never-throwing wrappers.
- Statuses/categories kept as the project's own enums (documented deviation from
  the suggested spec enums) to preserve working functionality.

---

## Known limitations

- Mock data only; no real backend or authentication.
- localStorage persistence may be unavailable in some environments.
- Photo uploads are metadata-only.
- No real-time updates.

---

## Libraries, templates and AI tools used

- Vite React+TS template (initial scaffold).
- MSW, React Router, Tailwind CSS, lucide-react, Vitest, Testing Library.
- AI assistance used for code generation and documentation.

---

## Progress

| Phase | Status | Summary |
|---|---|---|
| 0 — Inspection | ✅ Complete | Repo inspected, env verified |
| 1 — Week 1 foundations | ✅ Complete | Listing, search/filter, form, responsive |
| 2 — Components & data | ✅ Complete | MSW API, reusable components, data states |
| 3 — Quality & delivery | ✅ Complete | Routing, saved state, tests, docs |
| 4 — Final review | ✅ Complete | Tags, docs, deployment prep |

### Week 1 checkpoint
Tag `week-1` at commit `aadefa1`.

### Week 2 checkpoint
Tag `week-2` at commit `26676cd`.

### Week 3 checkpoint
Tag `week-3` at commit `9a58588`.

---

## License

BuildLab Stage 1 Frontend Development — demonstration project.
