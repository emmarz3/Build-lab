# CampusFix — Idea One-Pager

## Problem
Students encounter broken classroom equipment, damaged furniture, plumbing faults,
poor campus connectivity and other facility issues without a convenient,
transparent interface for documenting problems and tracking their status.

## Target user
A university student who needs to report and follow the status of campus
maintenance problems.

## Solution
CampusFix is a responsive frontend web app that lets students browse reported
campus issues, search and filter them, inspect individual issue details, submit
a new report, and save issues for later reference. Reports move through a clear
workflow (Submitted → Under Review → In Progress → Resolved) with a full
activity history.

## Scope
Frontend-only demonstration using fictional campus data and a mock HTTP API
(MSW). No real credentials, payments, chat, or backend. Clearly labelled as a
demonstration.

## Stack
React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, MSW, Vitest +
Testing Library, lucide-react.

## Key features
- Issue listing with search, filter (category/status/priority), sort.
- Issue detail with status management and activity history.
- New report form with validation.
- Operations dashboard with stats and breakdowns.
- Saved issues persisted to localStorage.
- Loading, empty, error, and retry states.
- Accessible, responsive, reduced-motion aware UI.

## Risks
- Mock data persistence limitations in deployed environments.
- Browser localStorage availability.
- No real backend; data is demonstration-only.
