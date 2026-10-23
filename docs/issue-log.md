# CampusFix — Issue Log

## 1. MSW not initially integrated
- **Issue:** Week 1/2 data lived only in localStorage; no mock HTTP API.
- **Impact:** Did not satisfy BuildLab data-integration requirement.
- **Solution:** Added MSW handlers and started worker in dev; created typed `issueApi` service using fetch.
- **Verification:** Network requests to `/api/issues` observed; tests pass.

## 2. Global styles not loaded
- **Issue:** `main.tsx` rendered `AppRouter` directly, bypassing `App.tsx` which imports `global.css` and `ToastProvider`.
- **Impact:** Styling and toasts broken in production build.
- **Solution:** Render `<App />` from `main.tsx`.
- **Verification:** CSS bundle restored to ~39 kB; build succeeds.

## 3. Deep-linking not supported
- **Issue:** Detail page relied solely on in-memory list; direct URL loads showed "not found".
- **Impact:** Failed deep-link requirement.
- **Solution:** Fetch issue by ID via `fetchIssue` when not in list; show loading/not-found states.
- **Verification:** Manual navigation to `/issues/:id` works.

## 4. Saved state not persisted
- **Issue:** No save/unsave or localStorage persistence.
- **Impact:** Failed Week 3 saved-issues requirement.
- **Solution:** `useSavedIssues` hook with localStorage sync; integrated into card and detail.
- **Verification:** Reload preserves saved IDs.

## 5. Route mismatch with spec
- **Issue:** App used `/reports` paths; spec requires `/issues`.
- **Impact:** Potential assessment mismatch.
- **Solution:** Added `/issues` routes (kept `/reports` aliases), updated nav and links.
- **Verification:** Build and tests pass; navigation works.

## 6. Storage abstraction threw in restricted environments
- **Issue:** localStorage access could throw.
- **Impact:** Potential runtime crash.
- **Solution:** Lazy `getStorage()` returning null; never-throw wrappers.
- **Verification:** Unit tests for storage pass.
