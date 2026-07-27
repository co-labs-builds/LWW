# Connection Readiness

## Page Package

- **Page Name:** Member Portal Login
- **Page Slug:** `member-portal-login`
- **Preflight Date:** 2026-07-27 (Ontraport re-verified same day after connector was enabled)
- **Overall Status:** `READY`

## Connection Checks

| Connection / Capability | Required for This Build? | Access Needed | Target / Scope | Verification Performed | Status | Limitation or Fallback |
|---|---:|---|---|---|---|---|
| Destination repository | Yes | Read + Write | `co-labs-builds/LWW` / `claude/ontraport-site-builder-testing-nji05b` / `Pages/member-portal-login/` | Listed repo root via GitHub API; authenticated as repo owner `co-labs-builds`; feature branch already tracked on `origin` | `READY` | None — direct commit/push available |
| Ontraport | Yes | Read only | Membership login form/action, password-reset URL, portal destination, merge tags | Connector enabled; read verified — account 270197, membership **site "Landmark Portal" (site_id 1, `landmark-portal.com`, 108 members)**, page meta, and pages list all readable | `READY` | None — dynamic pass completed; see notes below |
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

- **Connector Available:** Yes — enabled and verified (account 270197, PT timezone, LM Stripe gateway)
- **Relevant Objects Readable:** Yes — `sites` (157), `pages` (20), and custom objects readable
- **Field Metadata Readable:** Yes — `get_object_meta` on sites/pages succeeded
- **Merge Tags or Dynamic Field Syntax Verifiable:** Yes — confirmed **no merge tags are needed** on this pre-auth page
- **Dynamic Templates / Page URLs Readable:** Yes — pages list + `get_landing_page_url` available
- **Forms / Products / Events / Registrations / Invitations Readable:** Yes (not required for this page)
- **Membership or Visibility Settings Readable:** Partial — the membership **site** record is readable (name, domain, member counts), but the login/forgot-password/post-login-redirect wiring is **native Ontraport membership configuration** set in the site's settings UI and is not exposed as API data fields (confirmed via sites meta)
- **Write Access Used:** No
- **Notes:** Dynamic-mapping pass completed. Verified: membership site = **Landmark Portal (site_id 1)**, domain **`landmark-portal.com`**. Only 3 starter/test "My Account" pages currently exist on the site — **no login or member-home page is built yet**, so this is a net-new portal page. Login, password-reset, and post-login redirect are handled by Ontraport's **native membership login** (not merge tags/custom URLs). Account page-naming convention is `CATEGORY : Section : Name (type) (STATUS)`. No fields, tags, or URLs were invented. See `02-Link-Dynamic-Content-Map.md` for per-item resolution.

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

- **None outstanding.** The initial run proceeded under the Ontraport-`TBD` fallback; after the connector was enabled, the dynamic pass was completed and the fallback is no longer in effect.
- **Residual (configuration, not connectivity):** the exact login-page URL path and the post-login member-home page are set in Ontraport's membership UI and cannot be built here — the member-home page does not exist yet on the site.

## Blockers

- None.

## Proceed Decision

- **May asset extraction begin?** Yes (completed)
- **Reason:** Repository, source, and Ontraport connections are all `READY`. Dynamic mapping was verified against live Ontraport data.
