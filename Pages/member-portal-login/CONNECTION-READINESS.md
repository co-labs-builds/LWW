# Connection Readiness

## Page Package

- **Page Name:** Member Portal Login
- **Page Slug:** `member-portal-login`
- **Preflight Date:** 2026-07-27
- **Overall Status:** `READY WITH LIMITATIONS`

## Connection Checks

| Connection / Capability | Required for This Build? | Access Needed | Target / Scope | Verification Performed | Status | Limitation or Fallback |
|---|---:|---|---|---|---|---|
| Destination repository | Yes | Read + Write | `co-labs-builds/LWW` / `claude/ontraport-site-builder-testing-nji05b` / `Pages/member-portal-login/` | Listed repo root via GitHub API; authenticated as repo owner `co-labs-builds`; feature branch already tracked on `origin` | `READY` | None — direct commit/push available |
| Ontraport | Yes | Read only | Membership login form/action, password-reset URL, portal destination, merge tags | Connector present in org but **not enabled in this chat** (`enabledInChat: false`) | `BLOCKED` (read unavailable) | Continue with static package; login action, password-help link, and portal destination marked `TBD` |
| Source design/code | Yes | Read | Attached HTML file (`272b83cb-memberportallogin.html`) | Read full source; single self-contained HTML file with inline `<style>` and embedded base64 assets | `READY` | None — complete HTML/CSS present in one file |
| Live-page retrieval | No | — | — | Not needed; complete source supplied | `NOT REQUIRED` | — |
| External URL validation | Optional | Read | Typekit stylesheet `use.typekit.net/gwi7lul.css` | Not fetched; well-known Adobe Fonts host | `LIMITED` | Kit ID preserved as-is; validate in browser at build time |
| Supporting source/functionality system | No | — | — | No DeadlineFunnel, Calendly, Zoom, GTM/GA4, or checkout dependency in source | `NOT REQUIRED` | — |

## Repository Verification

- **Owner / Organization:** `co-labs-builds`
- **Repository:** `LWW`
- **Target Branch:** `claude/ontraport-site-builder-testing-nji05b`
- **Destination Path:** `Pages/member-portal-login/`
- **Read Verified:** Yes
- **Write Capability Verified:** Yes (authenticated as owner; branch exists on `origin`, git push available)
- **Preferred Delivery:** Direct commit to the designated feature branch
- **Notes:** Repo currently holds prior portal build files at root (`portal-pre-event.css`, `sms-formatting.js`, `disable-confirm-email-paste.js`). This package is namespaced under `Pages/member-portal-login/` and does not touch those files.

## Ontraport Read Verification

- **Connector Available:** Yes (installed in org) — but **not enabled in this chat**
- **Relevant Objects Readable:** No
- **Field Metadata Readable:** No
- **Merge Tags or Dynamic Field Syntax Verifiable:** No
- **Dynamic Templates / Page URLs Readable:** No
- **Forms / Products / Events / Registrations / Invitations Readable:** No
- **Membership or Visibility Settings Readable:** No
- **Write Access Used:** No
- **Notes:** No merge tags, field IDs, form actions, or URLs are invented. All dynamic wiring (login form action, password-reset link, post-login portal destination) is preserved from source and marked `TBD` in `02-Link-Dynamic-Content-Map.md`. To resolve, enable the Ontraport MCP connector for this chat and re-run the dynamic-mapping pass.

## Source Access Verification

- **Source Location:** Direct upload — `272b83cb-memberportallogin.html`
- **Complete HTML Available:** Yes
- **Complete CSS Available:** Yes (single inline `<style>` block)
- **JavaScript Available or Confirmed Unneeded:** Confirmed — page has no functional JS beyond an inline `onsubmit="return false;"` guard
- **Screenshots / Design Reference Available:** Not Required (source renders deterministically)
- **Assets Downloadable or Identifiable:** Yes — 3 embedded base64 assets extracted to `source/extracted-assets/`; 1 external stylesheet identified
- **Notes:** All page assets are embedded as base64 data URIs, so there are no expiring/signed source URLs to preserve for images or the display font.

## Accepted Limitations

List every fallback explicitly accepted by the user.

- **Pending user confirmation:** Ontraport read access unavailable in this chat; proceed with a static package and mark login action, password-reset link, and portal destination `TBD`.

Examples of the fallback in effect:

- Ontraport read access unavailable; preserve source placeholders and mark dynamic mappings `TBD`.

## Blockers

- None blocking the static package. Ontraport dynamic verification is deferred, not blocking, once the user accepts the fallback above.

## Proceed Decision

- **May asset extraction begin?** Yes
- **Reason:** Repository and source connections are `READY`. The only gap (Ontraport read) affects dynamic link/merge-tag verification only, which is handled by the documented `TBD` fallback and does not block section splitting, asset packaging, or code generation.
