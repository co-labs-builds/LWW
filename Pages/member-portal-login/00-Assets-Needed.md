# Assets Needed — Member Portal Login

## Asset Upload Decision

- Selected path: `CONTINUE WITH SOURCE URLS` (Path B — default; embedded data URIs retained with replacement markers). Revisit anytime by uploading the extracted files and returning URLs.
- Decision date: 2026-07-27
- Replacement intake file: `00A-Ontraport-Asset-URL-Intake.md` (created when `UPLOAD NOW` is chosen)

## Summary

- Total unique assets: **4** (3 embedded + 1 external dependency)
- Images: 2 (1 JPEG background, 1 PNG logo)
- SVG files: 0
- Inline SVGs: 1 (password-help lock icon)
- Video/audio: 0
- Fonts: 1 embedded (`Tiempos Headline`) + 1 external kit (`objektiv-mk1` via Adobe Fonts/Typekit)
- External dependencies: 1 (Typekit stylesheet)
- Assets requiring manual review: 1 (Typekit kit — validate license/kit ID; the existing repo self-hosts `objektiv-mk1` from Ontraport instead)

> **Note on source URLs:** All three page-specific assets are embedded as base64 data URIs in the source file, so there are **no signed/expiring source URLs** to preserve. They have been decoded to real files under `source/extracted-assets/` and are ready to download and upload to Ontraport.

## Download and Upload Checklist

### Stage background photograph

**Asset Type:** Raster image (JPEG, ~362 KB decoded, teal-toned photo of four people embracing over a misty vista)
**Used In Section / Component:** `01-stage` — `.stage` full-bleed background (`center 42% / cover`)
**Source URL:** Embedded base64 data URI — no standalone source URL. Extracted to `source/extracted-assets/member-portal-stage-bg.jpg`
**Ontraport URL:** `TBD`
**Suggested File Name:** `member-portal-stage-bg.jpg`
**Upload to Ontraport:** Yes
**Status or Risk:** Large (~362 KB); consider a compressed/WebP variant for performance. No expiring URL.
**Replacement Status:** Needs Upload
**Notes:** Referenced in `background:url(...)` inside `.stage`. Replace the data URI in `sections/01-stage/surface-level/stage.css` and `04-Master-Page.css`.

---

### Landmark logo (white)

**Asset Type:** Raster image (PNG, transparent, ~7.9 KB, white Landmark wordmark)
**Used In Section / Component:** `01-stage` — `<img class="brand-logo">`
**Source URL:** Embedded base64 data URI — no standalone source URL. Extracted to `source/extracted-assets/landmark-logo-white.png`
**Ontraport URL:** `TBD`
**Suggested File Name:** `landmark-logo-white.png`
**Upload to Ontraport:** Yes
**Status or Risk:** None. White wordmark intended for dark backgrounds. An SVG version would scale more crisply if available from brand assets.
**Replacement Status:** Needs Upload
**Notes:** Referenced in the `src` of `.brand-logo`. Replace the data URI in `sections/01-stage/surface-level/stage.html` and `source`-derived copies.

---

### Tiempos Headline — Light Italic (display font)

**Asset Type:** Font (WOFF2, ~28 KB, weight 300 / italic)
**Used In Section / Component:** `01-stage` — `.stage-eyebrow` ("Welcome to your")
**Source URL:** Embedded base64 data URI — no standalone source URL. Extracted to `source/extracted-assets/tiempos-headline-light-italic.woff2`
**Ontraport URL:** `TBD`
**Suggested File Name:** `tiempos-headline-light-italic.woff2`
**Upload to Ontraport:** Yes
**Status or Risk:** Licensed typeface (Klim Type Foundry). Confirm the Landmark license permits self-hosting on Ontraport before publishing. Only the Light Italic weight is used on this page.
**Replacement Status:** Needs Upload
**Notes:** Declared in a `@font-face` inside the page `<style>`. On upload, replace the base64 `src` with the Ontraport URL in `03-Design-System.css` (font declarations live there).

---

## Inline or Embedded Assets

| Asset | Where | Handling |
|---|---|---|
| **Password-help lock icon** | `02-panel` — `.help a svg` (24×24 stroked lock) | Inline SVG. Small, stable, section-specific — **keep inline** in `sections/02-panel/surface-level/panel.html`. No upload needed. |
| Stage background JPEG | `.stage` background | Embedded base64 → extracted (see checklist above). |
| Landmark logo PNG | `.brand-logo` src | Embedded base64 → extracted (see checklist above). |
| Tiempos Headline WOFF2 | `@font-face` | Embedded base64 → extracted (see checklist above). |

## External Dependencies

| Dependency | URL | Purpose | Handling |
|---|---|---|---|
| **Typekit / Adobe Fonts stylesheet** | `https://use.typekit.net/gwi7lul.css` | Provides `objektiv-mk1` (body/heading/button font, weights 300/400/700/800) | **Upload to Ontraport: No.** Runtime `<link>` dependency. Preserve the kit `<link>` in the page `<head>` (Ontraport page-level head/embed). **Manual review:** the existing repo (`portal-pre-event.css`) instead **self-hosts** `objektiv-mk1` from `file.ontraport.com` — if the project prefers self-hosting for consistency, swap the Typekit link for the self-hosted `@font-face` set already used elsewhere. Flagged for your decision. |
