# CampusFix

> A campus issue reporting and tracking platform — report, triage, and resolve
> facilities, equipment, and maintenance issues across a campus.

CampusFix is a single-page web application that lets students, staff, and
operations teams **submit**, **track**, and **resolve** campus issues (broken
projectors, electrical faults, plumbing leaks, cleaning requests, building
damage, and more). Reports move through a clear workflow — *Submitted → Under
Review → In Progress → Resolved* — with a full activity history, so everyone can
see what is happening and when.

This repository is the working codebase for the **Build-lab internship** task.
It is built incrementally in numbered phases (see [Progress](#progress)).

---

## ✨ Features

- **Report an issue** — validated form with title, description, category,
  location, priority, optional photo metadata, and reporter info.
- **Reports listing** — search, multi-filter (category / status / priority),
  sort, and a responsive card list view.
- **Report detail** — full report view with status management, "advance to next
  status" action, and a chronological activity history.
- **Operations dashboard** — summary stat cards (total, open, in progress,
  resolved), breakdowns by status / category / priority, and recent reports.
- **Toast notifications** — success / error feedback on submit and actions.
- **Page transitions** — subtle entrance animation that respects
  `prefers-reduced-motion`.
- **Persistent storage** — reports are stored in `localStorage` with a safe
  abstraction that never throws; demo seed data on first run.
- **Responsive & accessible** — semantic HTML, keyboard-friendly controls,
  design tokens for consistent theming.

## 🧱 Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 + CSS design tokens |
| Icons | lucide-react |
| Testing | Vitest + Testing Library (happy-dom) |
| Linting | oxlint |

## 🗂️ Project structure

```
.
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── public/                  # static assets
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── app/
    │   └── router.tsx       # route definitions
    ├── components/
    │   ├── layout/          # AppShell, Header, Footer, Nav, PageHeader
    │   ├── reports/         # ReportCard, ReportsList, SearchBar, FilterBar
    │   └── ui/              # Button, Card, Badge, Input, Select, …
    ├── features/
    │   ├── reports/         # domain: types, constants, service, storage,
    │   │                    # selectors, validation, context, demo data
    │   └── ui/              # Toast provider
    ├── lib/                 # utils (cn, etc.)
    ├── pages/               # route-level pages
    ├── styles/              # global.css, tokens.css
    └── test/                # test setup
```

## 🚀 Getting started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+

### Install & run

```bash
git clone https://github.com/emmarz3/Build-lab.git
cd Build-lab
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## 📜 Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc`) then production build |
| `npm run lint` | Run oxlint |
| `npm run test` | Run the Vitest suite once |
| `npm run preview` | Preview the production build |

## 🧪 Testing

The domain logic is kept pure (no React dependency) so it can be tested
directly. Run:

```bash
npm run test
```

Current suite: **21 tests** across `report.selectors`, `report.service`,
`report.storage`, and `report.validation` — all passing.

## 🧩 Data model

Core entity: `IssueReport` (see `src/features/reports/report.types.ts`).

```ts
interface IssueReport {
  id: string
  title: string
  description: string
  category: IssueCategory      // classroom-equipment | electrical | plumbing | …
  location: string
  priority: IssuePriority      // low | medium | high
  status: IssueStatus          // submitted | under-review | in-progress | resolved
  createdAt: string
  updatedAt: string
  activity: ReportActivity[]   // chronological history
  reporter?: string
}
```

Statuses follow a strict workflow order defined in `STATUS_ORDER`; only forward
transitions are allowed via `advanceStatus`. Reports are persisted to
`localStorage` under the key `campusfix-reports-v1`.

## 🏛️ Architecture notes

- **Feature-based folders** — domain code lives under `src/features/reports`,
  UI primitives under `src/components/ui`.
- **Context state** — `ReportsContext` is the single source of React state for
  reports, wrapping the service/storage layer.
- **Pure selectors** — filtering, searching, sorting, and counting are pure
  functions in `report.selectors.ts`, fully unit-tested.
- **Storage abstraction** — `report.storage.ts` wraps `localStorage` in a
  never-throwing class so SSR / restricted environments are safe.
- **Design tokens** — colors, spacing, and typography live in
  `src/styles/tokens.css` and are consumed via CSS variables.

## 📈 Progress

The project is delivered in phases. Each phase is a commit on `main`.

| Phase | Status | Summary |
|---|---|---|
| 1 — Foundation | ✅ Complete | Vite/React/TS setup, design tokens, data model, context state, UI components, routing, demo data |
| 2 — Reports listing | ✅ Complete | Reports page with search, filter, sort, and list view |
| 3 — Report detail | ✅ Complete | Detail page with activity history and status management |
| 4 — New report form | ✅ Complete | Validated form, toast notifications, submission flow |
| 5 — Dashboard & polish | 🟡 In progress | Operations dashboard, PageTransition, storage hardening, test suite (21 tests) |
| 6 — (planned) | ⏳ Planned | Photo uploads, auth, backend sync, deployment |

### Phase 5 details (current)

- Operations dashboard with stat cards and breakdowns by status / category /
  priority, plus recent reports.
- `PageTransition` component with reduced-motion support.
- Hardened `localStorage` abstraction (lazy access, never throws).
- Vitest suite: selectors, service, storage, validation (21 passing tests).
- Tailwind CSS 4 wired through `@tailwindcss/vite`.

## 🛣️ Roadmap

- Persisted photo uploads (currently metadata-only).
- Authentication and per-user report ownership.
- Backend sync (replace `localStorage` with an API).
- Deployment (Vercel) and CI.
- Accessibility audit and i18n.

## 📄 License

This project is part of an internship (Build-lab). All rights reserved by the
author unless stated otherwise.

---

_Built with ❤️ for the Build-lab internship._
