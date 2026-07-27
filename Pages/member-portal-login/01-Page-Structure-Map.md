# Page Structure Map — Member Portal Login

**Page Slug:** `member-portal-login`
**Class Prefix:** `lm`
**Destination:** `LWW/Pages/member-portal-login/`

## Block Legend Used

| Block # | Background Color | Template Name / Notes |
|---:|---|---|
| 1 | `#ffffff` | White |
| 2 | `#41454a` | Tab Grey |
| 3 | `#f7f5ef` | Paper |
| 4 | `#efede7` | Almond |
| 5 | `#0d2d31` | Teal |
| 6 | `#0a2226` | Deep Teal |

---

## ⚠️ Layout note — this page is a full-height, two-column split

Unlike a normal stacked Ontraport page, this login screen is a **single
full-viewport split**: the stage (branded photo) and panel (login form) sit
**side by side** and only stack vertically below 900px. Ontraport blocks stack
vertically, so the two sections below **do not each get their own block**.

**Recommended Ontraport placement:** ONE block → ONE Custom HTML element
(`lm-login-wrap`). Inside that element, paste the shared wrapper and both
sections in order:

```html
<div class="lm-login__inner">
  <!-- paste sections/01-stage/surface-level/stage.html here -->
  <!-- paste sections/02-panel/surface-level/panel.html here -->
</div>
```

The `.lm-login__inner` flex container (source `.portal`) provides the
`display:flex; min-height:100vh` split and the deep-teal base. Both sections are
therefore mapped with **Placement: same Custom HTML element** (panel appended
after stage).

---

## Sections

1. Section Name: Stage (branded left column)
Block #: 6 (Deep Teal `#0a2226` — the base behind the split; the visible stage surface is a **photo background**, not a flat block color, so no exact block-color match applies to the stage itself)
Background Color: `#0a2226` base / photographic background image (`member-portal-stage-bg.jpg`) with dark teal gradient overlay
Class Name: `lm-portal lm-login` (outer block classes)
HTML Element Class Name: `lm-login-wrap` (shared — one Custom HTML element for the whole split)
Root HTML Class: `lm-login__inner` (shared split-flex wrapper) → section root `lm-login__stage`
Anchor ID: (none in source)
Surface-Level Path: `sections/01-stage/surface-level/stage.html`
Requires JavaScript: No
Functional Components: None
Notes: Contains the white Landmark logo (`landmark-logo-white.png`), eyebrow "Welcome to your" (Tiempos Headline italic), title "Member Portal" (objektiv-mk1 800 uppercase), and a green accent rule. Background image + `::before` gradient overlay. **Placement: paste inside `lm-login__inner`, first.**

------------------------------------------------------

2. Section Name: Panel (login form, right column)
Block #: 5 (Teal `#0d2d31` — exact match to `--lm-primary`, the panel background)
Background Color: `#0d2d31` (Teal) with a subtle green radial glow (`::before`)
Class Name: `lm-portal lm-login` (same outer block — see layout note)
HTML Element Class Name: `lm-login-wrap` (same Custom HTML element as Stage)
Root HTML Class: `lm-login__inner` (shared) → section root `lm-login__panel`
Anchor ID: (none in source)
Surface-Level Path: `sections/02-panel/surface-level/panel.html`
Requires JavaScript: No (login submission handled by Ontraport membership form — see `02-Link-Dynamic-Content-Map.md` LNK-001)
Functional Components: None packaged separately. The login `<form>` is native page content, not an overlay. It must be wired to the Ontraport membership login (TBD).
Notes: Contains "Welcome back." heading, subhead, email + password fields, Log In button, a "Password help" link with an inline SVG lock icon (kept inline), and a footer with support email/phone. **Placement: paste inside `lm-login__inner`, immediately after the stage section.**

------------------------------------------------------

## Color → Block mapping summary

| Surface | Rendered color | Legend match | Block # |
|---|---|---|---:|
| Portal base (behind split) | `#0a2226` Deep Teal | Exact | 6 |
| Stage visible surface | Photo + teal gradient | No flat-color match (image) | — (uses Block 6 base) |
| Panel | `#0d2d31` Teal | Exact | 5 |

Because both columns live in one block, choose the **Block 6 (Deep Teal)** base
block; the panel's teal (`#0d2d31`) is applied by `.lm-login__panel` CSS, and
the stage's photo by `.lm-login__stage` CSS. No second block is required.
