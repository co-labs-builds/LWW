# Member Portal Login

## Page Summary

**Page Slug:** `member-portal-login`
**Page Type:** Membership login / gateway page
**Build Status:** Packaged for Ontraport build — dynamic pass completed against live Ontraport (2026-07-27); login/reset/redirect resolved to native membership features
**Primary Purpose:** Let existing Landmark members sign in to reach their Member Portal
**Primary Audience:** Existing Landmark Worldwide members/participants with an account
**Visibility / Access:** Public URL (the login screen itself is unauthenticated); it gates access to the authenticated member area
**Lifecycle Stage:** Returning-member re-entry point (post-enrollment, ongoing engagement)

### What this page is

A full-viewport, two-column login screen. The left "stage" column is a branded,
photographic panel (Landmark logo, "Welcome to your / Member Portal" headline).
The right "panel" column holds the sign-in form (email, password, Log In),
a "Password help" link, and a support footer.

### What this page is intended to accomplish

Authenticate a returning member and route them into the Member Portal. Secondary
goal: give first-time or locked-out members a path to password help.

## URL & Ontraport Configuration

| Setting | Required Value | Status / Notes |
|---|---|---|
| Ontraport Page Name | `PORTAL : Login : Member Portal Login (lp)` | Matches account naming convention `CATEGORY : Section : Name (type) (STATUS)` |
| Ontraport Page Type | Membership site page (login) on **Landmark Portal** site | Wire form to native Ontraport membership login (LNK-001) |
| Domain | `landmark-portal.com` | ✅ Verified — Landmark Portal site domain |
| URL Path | e.g. `/login` | Set in site settings; portal root currently unused |
| Full URL | e.g. `landmark-portal.com/login` | Confirm path in site UI |
| Dynamic Template Object | `N/A` | Static pre-auth page; no per-record templating |
| Record Identifier / URL Parameter | `N/A` | — |
| Membership Site / Access Rule | **Landmark Portal** (site_id `1`, 108 members) | ✅ Verified |
| Login Required | No (this IS the login) | Gates the Landmark Portal member area |
| Search Indexing | Recommend Noindex | Confirm |
| Page Tracking | `TBD` | GA4 / GTM / OP tracking per project standard |
| Page-Level CSS | `04-Master-Page.css` | Paste into page Custom Code |
| Page-Level JavaScript | `N/A` | No custom JS required |
| Forms / Checkout Dependencies | Ontraport membership login form (LNK-001) | Must replace static placeholder form |
| External System Dependencies | Adobe Fonts (Typekit kit `gwi7lul`) for `objektiv-mk1` | Or self-host per repo standard — see 00-Assets-Needed.md |

## Audience & Visibility

### Who can see this page

Anyone with the URL can see the login screen. Only members with valid Ontraport
membership credentials can pass through it.

### Required record, status, or access conditions

Valid member credentials in the **Landmark Portal** membership site (site_id 1,
`landmark-portal.com`). 108 members currently exist on this site.

### What should happen when access requirements are not met

Failed login shows an error state (LOGIC-001, handled by Ontraport). First-time
or forgotten-password members use the "Password help" link (LNK-002, URL `TBD`).

## Customer Journey Context

### Pages, messages, or actions that can lead into this page

| Source Page / Channel | Audience | Entry Condition | Link / Map ID | Notes |
|---|---|---|---|---|
| Portal bookmark / direct URL | Members | Returning to portal | — | Primary entry |
| Emails linking to the portal | Members | "Log in to your portal" CTA | `TBD` | Confirm which emails link here |
| Session timeout / logout redirect | Members | Session expired | LNK-005 (reverse) | Confirm |

_All inbound sources are inferred/`TBD`; none are explicit in the source file._

### Where this page can lead

| Destination Page / Action | User Action | Condition | Link / Map ID | Notes |
|---|---|---|---|---|
| Landmark Portal member home | Successful login | Valid credentials | LNK-005 | ⚠️ Member-home page not built yet on site 1 — create it, then set as post-login redirect |
| Native password reset | Click "Password help" | Forgot/first-time | LNK-002 | Native Ontraport reset for Landmark Portal site |

## Page Structure

The implementation order, block numbers, colors, block classes, HTML element
classes, and component folders are documented in:

- `01-Page-Structure-Map.md`

### Section Summary

| # | Section | Purpose | Block # | Functional Components |
|---:|---|---|---:|---|
| 1 | Stage | Branding + welcome headline over photo | 6 (base; photo surface) | None |
| 2 | Panel | Login form + password help + support footer | 5 (Teal) | None |

> Both sections render as one full-height split inside a **single Ontraport
> block / single Custom HTML element** (`lm-login-wrap`). See the layout note in
> `01-Page-Structure-Map.md`.

## Dynamic Content, Links & Display Logic

The complete implementation authority for static links, dynamic URLs, field
merge tags, conditional display logic, and interaction wiring is:

- `02-Link-Dynamic-Content-Map.md`

### Primary data sources

- **Contact:** None on this pre-auth page (no personalization in source)
- **Event:** N/A
- **Registration:** N/A
- **Invitation:** N/A
- **Other custom objects:** Ontraport membership/login system (auth only)

### Critical dynamic requirements

1. **LNK-001** — Replace the static `onsubmit="return false;"` form with
   Ontraport's **native membership login block** for the Landmark Portal site.
   **Must not ship as-is.**
2. **LNK-002** — Point "Password help" at the site's **native password-reset**
   link.
3. **LNK-005** — Post-login redirect → Landmark Portal member home. ⚠️ That page
   does not exist yet; build it first.

## Functional Behavior

No JavaScript. The only interactivity is CSS focus rings on inputs and hover/
active states on the Log In button. Authentication behavior is provided by
Ontraport's membership login, not by page code.

## Assets

All downloadable and externally hosted assets are listed in:

- `00-Assets-Needed.md`

Three assets are embedded as base64 in the source (extracted to
`source/extracted-assets/`): the stage background photo, the white Landmark
logo, and the Tiempos Headline display font. Upload them to Ontraport and
replace the `REPLACE_WITH_ONTRAPORT_URL/...` markers in the code.

## Build Files

- `ONTRAPORT-BUILD-INSTRUCTIONS.md` — page assembly and implementation steps
- `00-Assets-Needed.md` — asset source inventory
- `00A-Ontraport-Asset-URL-Intake.md` — asset URL intake sheet (Path A)
- `01-Page-Structure-Map.md` — section/block/class implementation map
- `02-Link-Dynamic-Content-Map.md` — URLs, fields, merge tags, logic, interactions
- `03-Design-System.css` — reusable foundation (fonts, tokens, resets)
- `04-Master-Page.css` — complete page CSS
- `06-Validation-Report.md` — build-readiness audit
- `sections/` — paste-ready section files
- `source/` — untouched original HTML/CSS + extracted assets

## Known Risks, Open Questions & TBD Items

- **Ontraport dynamic pass complete (2026-07-27).** Membership site (Landmark
  Portal, site_id 1), domain (`landmark-portal.com`), and login/reset/redirect
  mechanism (native membership features) are **verified**. Remaining items are
  UI-configuration, not unknown data:
  - **LNK-005 blocked by a missing page** — the Landmark Portal member-home /
    dashboard does not exist yet; build it, then set as the post-login redirect.
  - Exact login URL path and tracking are set in the Ontraport UI.
- **Static login form** must be replaced with the native Ontraport membership
  login block for the Landmark Portal site.
- **Body font source:** page uses Typekit; repo elsewhere self-hosts
  `objektiv-mk1`. Pick one (00-Assets-Needed.md).
- **Tiempos Headline license:** confirm self-hosting on Ontraport is permitted.
- **Stage background** is ~362 KB; consider a compressed/WebP variant.
- **Footer email/phone** are static text; decide if they should be clickable.

Do not invent unresolved merge tags, dynamic URLs, access rules, record
identifiers, or display logic. Resolve them through Ontraport and update both
this README and the Link & Dynamic Content Map.

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-07-27 | Initial page package created | Claude (landmark-site-build skill) |
| 2026-07-27 | Ontraport dynamic pass — verified Landmark Portal site (id 1), domain, native login/reset/redirect; updated readiness, link map, README | Claude (landmark-site-build skill) |

## Implementation Documents

- `CONNECTION-READINESS.md` — verified connector access, permissions, fallbacks, and preflight outcome.
