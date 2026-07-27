# Member Portal Login

## Page Summary

**Page Slug:** `member-portal-login`
**Page Type:** Membership login / gateway page
**Build Status:** Packaged for Ontraport build — dynamic wiring `TBD` (Ontraport read access unavailable at packaging time)
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
| Ontraport Page Name | `Member Portal — Login` | Suggested; confirm |
| Ontraport Page Type | Membership login page | Wire form to native Ontraport membership login (LNK-001) |
| Domain | `TBD` | Not supplied |
| URL Path | `TBD` (e.g. `/portal/login`) | Not supplied |
| Full URL | `TBD` | Not supplied |
| Dynamic Template Object | `N/A` | Static pre-auth page; no per-record templating |
| Record Identifier / URL Parameter | `N/A` | — |
| Membership Site / Access Rule | `TBD` | Which membership site does this log into? |
| Login Required | No (this IS the login) | Gates the member area behind it |
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

Valid member credentials in the target Ontraport membership site. Exact
membership site / access group is `TBD` (needs Ontraport).

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
| Member Portal home/dashboard | Successful login | Valid credentials | LNK-005 | Destination `TBD` (Ontraport membership setting) |
| Password reset / setup | Click "Password help" | Forgot/first-time | LNK-002 | URL `TBD` |

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

1. **LNK-001** — Wire the login form to Ontraport membership login (currently a
   static `onsubmit="return false;"` placeholder). **Must not ship as-is.**
2. **LNK-002** — Password-help URL.
3. **LNK-005** — Post-login redirect destination.

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

- **Ontraport not connected at build time** → login action (LNK-001), password
  help URL (LNK-002), post-login redirect (LNK-005), membership site, domain,
  URL path, and tracking are all `TBD`. Resolve in Ontraport.
- **Static login form** must be replaced with a real Ontraport membership login.
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

## Implementation Documents

- `CONNECTION-READINESS.md` — verified connector access, permissions, fallbacks, and preflight outcome.
