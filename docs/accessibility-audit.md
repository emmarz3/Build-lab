# CampusFix — Accessibility Audit

## Tooling
Lighthouse/axe CLI not available in this environment. Manual audit performed
against WCAG 2.2 AA principles.

## Checks performed
- Semantic HTML landmarks (header, main, footer, nav).
- Heading hierarchy (h1 per page, h2/h3 sections).
- Form labels associated with inputs.
- Visible keyboard focus rings (focus-visible styles).
- Button accessible names.
- Color contrast (design tokens chosen for ≥4.5:1 on normal text).
- Reduced-motion respect (`prefers-reduced-motion`).
- Mobile usability (no horizontal overflow at 320px).
- Modal/dialog behaviour: N/A (no modals).

## Findings & fixes
- Initial: focus rings present; no critical issues found.
- Empty/error states use text, not colour alone.
- Status badges include icons.

## Before/after
Initial manual score: pass (no blocking issues). After fixes: pass.
No numeric Lighthouse score available; documented as limitation.
