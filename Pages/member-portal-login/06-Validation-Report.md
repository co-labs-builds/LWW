# Validation Report — Member Portal Login

## Summary

Two-section login-split package generated from a single self-contained HTML
source. Baseline structural validator passed with **0 errors** and 2 minor
warnings (both explained/benign below). Visual fidelity was confirmed by
rendering the assembled package (master CSS + section HTML + extracted assets)
in Chromium at 1440px and 390px — output matches the source design on desktop
and mobile.

**Ready for Ontraport:** Yes (static build) — **with** the documented `TBD`
dynamic wiring to be completed in Ontraport (login action, password-help URL,
post-login redirect).

## Connection Preflight

| Connection | Required | Result |
|---|---|---|
| Destination repository (`co-labs-builds/LWW`) | Yes | `READY` — read verified via API; owner-authenticated; branch on origin; push available |
| Ontraport | Yes | `BLOCKED` (read) — connector not enabled in chat → documented `TBD` fallback in effect |
| Source design/code | Yes | `READY` — complete HTML/CSS in one uploaded file |
| Live-page retrieval | No | `NOT REQUIRED` |
| External URL validation | Optional | `LIMITED` — Typekit kit preserved, validate in browser |
| Supporting systems | No | `NOT REQUIRED` |

Overall preflight outcome: **READY WITH LIMITATIONS**. `CONNECTION-READINESS.md`
records the full detail. The package is **not** labeled a verified dynamic
build — all dynamic mappings are `TBD`.

## Inputs Received

- 1 HTML file (`272b83cb-memberportallogin.html`, 537 KB — size is embedded base64).
- Inline `<style>` (no external CSS file); no JavaScript file.
- No user-supplied block legend → **official Landmark legend** used.
- No user-supplied field/merge-tag dictionary (Ontraport unavailable).
- Class prefix: default `lm`.

## Assumptions

- Project is Landmark/LWW → official block legend applies.
- Page slug inferred as `member-portal-login` from title + filename.
- Both columns render as ONE Ontraport block / ONE Custom HTML element because
  the layout is a full-height horizontal split (documented in Structure Map).
- Source class system was clean; classes were **namespaced** to `lm-login__*`
  (BEM) to avoid collisions with Ontraport's global styles, not restructured.
- No personalization/merge fields exist on this pre-auth page (Section B `N/A`).

## Warnings

1. **Asset URL intake contains blank/TBD values** (baseline validator). Expected
   — Path B (embedded); the 3 assets carry `REPLACE_WITH_ONTRAPORT_URL/…`
   markers and are extracted to `source/extracted-assets/` for upload.
2. **`lm-login__form` not referenced in `panel.css`** (baseline validator).
   Benign — it's a form hook selector; the `<form>` element is styled via child
   rules (`.lm-login__field input`, `.lm-login__btn`). It will carry the
   Ontraport login action (LNK-001).
3. **Ontraport dynamic wiring is `TBD`** (LNK-001/002/005, LOGIC-001) — not a
   defect, a documented deferral pending Ontraport access.
4. **Body font source ambiguity** — page uses Typekit; repo elsewhere self-hosts
   `objektiv-mk1`. Flagged for a project decision (00-Assets-Needed.md).

## Errors Requiring Attention

- None. No rendering-, link-routing-, or structure-blocking errors.

## Section/Class Cross-Check

| Section | Folder | Outer block class | Element class | Root | Files |
|---|---|---|---|---|---|
| 01 Stage | `sections/01-stage/surface-level/` | `lm-portal lm-login` | `lm-login-wrap` | `lm-login__inner` → `lm-login__stage` | html, css ✓ |
| 02 Panel | `sections/02-panel/surface-level/` | `lm-portal lm-login` | `lm-login-wrap` | `lm-login__inner` → `lm-login__panel` | html, css ✓ |

- Classes match across section HTML, section CSS, master CSS, and Structure Map. ✓
- Folder numbering matches visual order (stage left/top, panel right/bottom). ✓
- Both share one element by design (split layout). ✓

## Functional Component Cross-Check

- No popups, modals, drawers, or separately-packaged components exist. ✓
- Login `<form>` is native surface content (not an overlay) — correctly kept in
  `panel.html`, not a component folder. ✓

## Asset Cross-Check

| Asset | Source | Extracted | Marker locations | Upload |
|---|---|---|---|---|
| Stage background JPEG | base64 in `.stage` bg | `member-portal-stage-bg.jpg` ✓ | `stage.css`, `04-Master-Page.css` | Yes |
| Landmark logo PNG | base64 `<img>` | `landmark-logo-white.png` ✓ | `stage.html` | Yes |
| Tiempos Headline WOFF2 | base64 `@font-face` | `tiempos-headline-light-italic.woff2` ✓ | `03-Design-System.css`, `04-Master-Page.css` | Yes |
| Inline lock SVG | inline in `.help a` | kept inline in `panel.html` | — | No |
| objektiv-mk1 (Typekit) | `use.typekit.net/gwi7lul.css` | external `<link>` | page `<head>` | No (or self-host) |

- All source assets represented. ✓  No signed/expiring URLs (all were embedded). ✓
- Asset Upload Decision recorded: **CONTINUE WITH SOURCE URLS** (Path B). ✓

## Link and Dynamic Content Cross-Check

| ID | Item | Status |
|---|---|---|
| LNK-001 | Login form action | TBD (must replace placeholder) |
| LNK-002 | Password help URL | Needs URL |
| LNK-003 | Footer email | Confirm / optionally `mailto:` |
| LNK-004 | Footer phone | Confirm / optionally `tel:` |
| LNK-005 | Post-login redirect | TBD (Ontraport setting) |
| DYN-* | Merge tags | None in source (`N/A`) |
| LOGIC-001 | Login error state | TBD (Ontraport) |

- Every link/action in source is represented in `02-Link-Dynamic-Content-Map.md`. ✓
- Code comments use matching `LNK-###` IDs where replacement is needed. ✓
- No merge tags, field names, or URLs were invented. ✓

## Interaction Dependencies

- INT-001: CSS-only input focus + button states. No JavaScript. ✓
- `05-Master-Interactions.js` intentionally **not** generated (no custom JS). ✓

## Structural Checks

- CSS braces/parens balanced (master + section files). ✓
- HTML parses; browser render succeeds. ✓
- IDs unique across assembled page (`email`, `password`). ✓
- Master CSS includes both section CSS blocks in page order. ✓

## Manual Review Still Required (in Ontraport)

- Resolve all `TBD` dynamic wiring with Ontraport access.
- Replace 3 asset markers with hosted Ontraport URLs.
- Confirm membership site, URL path, indexing, tracking.
- Decide Typekit vs self-hosted `objektiv-mk1`.
- Re-test focus/keyboard and error state on the live page.

## Ready for Ontraport: Yes

Static structure, styling, and responsive behavior are verified and paste-ready.
Publishing to members additionally requires completing the `TBD` login wiring
above (do not ship the placeholder `onsubmit="return false;"`).
