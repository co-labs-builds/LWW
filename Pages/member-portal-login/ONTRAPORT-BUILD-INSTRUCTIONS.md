# Ontraport Build Instructions — Member Portal Login

This page is a **full-height, two-column login split**. It differs from a normal
stacked Ontraport page: both sections live in **ONE block** inside **ONE Custom
HTML element**. Read the layout note in `01-Page-Structure-Map.md` first.

> **Source of truth:** the repository package. Any fix you make in Ontraport must
> also be made in the matching `sections/…` files and in `04-Master-Page.css`.

## Before You Begin

1. Open `CONNECTION-READINESS.md` — this package was built with repository +
   source access `READY`, but **Ontraport read access was unavailable**, so all
   dynamic wiring is marked `TBD`.
2. Open `README.md` — confirm purpose, audience, membership site, URL path, and
   settings (several are `TBD`).
3. Open `00-Assets-Needed.md` — Asset Upload Decision is **CONTINUE WITH SOURCE
   URLS / embedded** (Path B). The code contains `REPLACE_WITH_ONTRAPORT_URL/…`
   markers because all assets are embedded base64 (no source URLs exist). The
   real files are in `source/extracted-assets/`.
4. Open `01-Page-Structure-Map.md` and `02-Link-Dynamic-Content-Map.md`.

## 1. Create and Configure the Ontraport Page

Create the page on the **Landmark Portal** membership site (site_id 1,
`landmark-portal.com`) using `README.md` settings. Verified vs. still-to-set:

- Membership site: **Landmark Portal** ✅ (verified)
- Domain: `landmark-portal.com` ✅ (verified); URL path e.g. `/login` — set in UI
- Suggested page name: `PORTAL : Login : Member Portal Login (lp)` (account convention)
- Search indexing (recommend **Noindex**) — set in UI
- Tracking (GA4 / GTM / OP) — set in UI

Add the Typekit font link to the page `<head>` / custom head area:

```html
<link rel="stylesheet" href="https://use.typekit.net/gwi7lul.css">
```

(Or use the self-hosted `objektiv-mk1` `@font-face` set per repo standard — see
`00-Assets-Needed.md`.)

## 2. Create the Single Block + Custom HTML Element

1. Add **one** prebuilt block — **Block 6 (Deep Teal `#0a2226`)**. It should be
   full width, zero margin, zero padding.
2. In block settings, add the block class: `lm-portal lm-login`
3. Add **one** blank Custom HTML element inside the block.
4. Open the HTML element settings → **Position** → add class: `lm-login-wrap`
5. Save.

> You do **not** add a second block for the panel. The panel's teal color and the
> stage's photo are applied by the master CSS.

## 3. Paste the Surface-Level HTML (both sections, one element)

Into that single `lm-login-wrap` Custom HTML element, paste this wrapper, then
both section files in order:

```html
<div class="lm-login__inner">

  <!-- ▼ paste sections/01-stage/surface-level/stage.html here ▼ -->

  <!-- ▼ paste sections/02-panel/surface-level/panel.html here ▼ -->

</div>
```

1. Copy the full contents of `sections/01-stage/surface-level/stage.html` into
   the first marker.
2. Copy the full contents of `sections/02-panel/surface-level/panel.html` into
   the second marker.
3. Save the element and page. Publish and preview.

## 4. Popups / Modals / Forms / Components

**None on this page.** The login form is native page content. There are no
popup, modal, drawer, or separately-packaged component folders.

## 5. Confirm / Replace Asset URLs

All three assets are embedded base64 and represented by
`REPLACE_WITH_ONTRAPORT_URL/…` markers. For each (see `00-Assets-Needed.md` and
`00A-Ontraport-Asset-URL-Intake.md`):

1. Upload the file from `source/extracted-assets/` to Ontraport using the
   suggested filename.
2. Copy its **direct** Ontraport-hosted URL.
3. Replace the marker everywhere it appears:
   - `landmark-logo-white.png` → `stage.html` (and master page if referenced)
   - `member-portal-stage-bg.jpg` → `stage.css` **and** `04-Master-Page.css`
   - `tiempos-headline-light-italic.woff2` → `03-Design-System.css` **and**
     `04-Master-Page.css`
4. Update `00-Assets-Needed.md` and `00A-Ontraport-Asset-URL-Intake.md`.
5. Preview and verify crop, logo, and font rendering.

## 6. Implement Links & Dynamic Wiring

Work through `02-Link-Dynamic-Content-Map.md`. The Ontraport dynamic pass is
done — this page belongs to the **Landmark Portal** membership site (site_id 1,
`landmark-portal.com`). Login/reset/redirect are **native membership features**:

- **LNK-001** — Replace the static login `<form>` (`onsubmit="return false;"`)
  with Ontraport's **native membership login block** for the Landmark Portal
  site, then restyle it (or map its inputs) to the `.lm-login__field` /
  `.lm-login__btn` classes. **Do not ship the placeholder.**
- **LNK-002** — Point "Password help" at the site's **native password-reset**
  link (not a custom URL).
- **LNK-003 / LNK-004** — Confirm the support email/phone and decide whether to
  make them clickable `mailto:` / `tel:` links.
- **LNK-005** — Set the post-login redirect in the Landmark Portal site
  settings. ⚠️ The member-home page does not exist yet — build/designate it
  first, then point the redirect at it.
- **LOGIC-001** — Confirm/style the native invalid-credentials error state.

There are **no merge tags** on this pre-auth page (Section B is `N/A`).

## 7. Add the Master CSS

1. Open `04-Master-Page.css`, copy all.
2. In Ontraport, deselect any block/element → **Settings → Custom Code**.
3. Paste into the page-level CSS area → **Done** → Save & publish.

Do not also paste the individual section CSS files (they are troubleshooting
backups).

## 8. Master JavaScript

**Not required.** No `05-Master-Interactions.js` exists — the page has no custom
JavaScript. (Login behavior comes from Ontraport's membership system.)

## 9. Preview & First QA Pass

Verify:

- Two-column split on desktop; clean vertical stack ≤ 900px (stage on top).
- Background photo crop (`center 42%`) and gradient legibility of the headline.
- Logo, eyebrow (Tiempos italic), and title (objektiv 800) render with fonts.
- Panel teal, input focus rings (green), Log In hover/active.
- Password-help link + footer legible.
- Mobile ≤ 420px spacing/heading sizes.

Use `06-Validation-Report.md` as the QA baseline.

## 10. Refinement Process

Section by section. Example:

```text
Page: member-portal-login
Section: 02-panel
Viewport: desktop, 1440px
Issue: Increase field label contrast.
Please update sections/02-panel/surface-level/panel.css and 04-Master-Page.css
in the repo, then provide the replacement code.
```

Always update the repo files **and** the master CSS — not just Ontraport.

## 11. Final Publish Checklist

- Membership site, URL path, indexing, tracking resolved (no `TBD`).
- Single block + single `lm-login-wrap` element contains both sections.
- Block class `lm-portal lm-login` and element class `lm-login-wrap` applied.
- All three asset markers replaced with stable Ontraport URLs.
- LNK-001 login wired to real Ontraport membership login (placeholder removed).
- LNK-002 / LNK-005 destinations set and tested.
- Master CSS pasted once; Typekit (or self-hosted) font loading.
- Desktop / tablet / mobile QA complete.
- Keyboard tab order + visible focus acceptable.
- Published URL matches README; repo package matches Ontraport.
