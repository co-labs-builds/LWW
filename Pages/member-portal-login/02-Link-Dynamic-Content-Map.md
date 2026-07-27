# Link & Dynamic Content Map — Member Portal Login

**Page Slug:** `member-portal-login`
**Destination:** `LWW/Pages/member-portal-login/`

> **Ontraport read access completed (2026-07-27).** Verified against live data:
> membership site **"Landmark Portal"** (site_id **1**, domain
> **`landmark-portal.com`**, 108 members). Login, password-reset, and post-login
> redirect are **native Ontraport membership-site features** configured in the
> site's settings UI — they are not merge tags or custom page URLs, and Ontraport
> does not expose them as API data fields. Nothing was invented. Items below are
> updated with verified specifics; the few remaining `TBD`s are UI-configuration
> steps (and one page that does not exist yet), not unknown data.

## Status Legend

- **Ready** — final value and implementation are known.
- **Needs URL** — destination URL has not been supplied.
- **Needs Field** — Ontraport field or merge tag has not been supplied.
- **Needs Logic** — display or action logic requires confirmation.
- **TBD** — unresolved source requirement; do not guess.

---

## A. Link and Action Destinations

### LNK-001 — Login form submission

**Section / Component:** 02-panel — login form
**Visible Label or Purpose:** Authenticate a member and start their session
**Element Selector:** `.lm-login__form` (`<form>` in `panel.html`)
**Source href / action / handler:** `onsubmit="return false;"` (static placeholder — no real action)
**Required Final Destination:** Native login for membership site **Landmark Portal** (site_id 1, `landmark-portal.com`)
**Link Type:** Native Ontraport membership login
**Ontraport Field or Dynamic URL Source:** Ontraport membership-site **native login block** for site "Landmark Portal" — verified this is native functionality, not a merge tag or custom endpoint
**Display Condition:** Always visible
**Fallback Behavior:** On failed auth, Ontraport shows the site's login error state
**Status:** Resolved (mechanism) — implement with Ontraport's native login element
**Notes:** Replace the static `<form>` (`onsubmit="return false;"`) with Ontraport's membership login element/block for the Landmark Portal site. Keep this page's styling by mapping the login block's email/password inputs and submit button to the `.lm-login__field`/`.lm-login__btn` classes (or restyle the native block to match). Ontraport handles session/auth. Do not ship the placeholder.

### LNK-002 — "Password help" link

**Section / Component:** 02-panel — help block
**Visible Label or Purpose:** First-time setup / forgot-password recovery
**Element Selector:** `.lm-login__help a`
**Source href / action / handler:** `href="#"` (placeholder)
**Required Final Destination:** Ontraport's native "forgot password" flow for the Landmark Portal site
**Link Type:** Native Ontraport membership function
**Ontraport Field or Dynamic URL Source:** Membership-site native password-reset link (not a custom URL/merge tag) — verified via sites read
**Display Condition:** Always visible
**Fallback Behavior:** None
**Status:** Resolved (mechanism) — use the site's native reset link
**Notes:** Ontraport membership sites provide a built-in password-reset link. Point the "Password help" anchor at that native reset action for site "Landmark Portal." Confirm in the site settings UI whether first-time setup uses the same flow (108 members already exist, so returning-member reset is the primary case).

### LNK-003 — Support email

**Section / Component:** 02-panel — footer
**Visible Label or Purpose:** Contact support
**Element Selector:** `.lm-login__foot` (text `info@landmarkworldwide.com`)
**Source href / action / handler:** Plain text (not currently a `mailto:` link)
**Required Final Destination:** `mailto:info@landmarkworldwide.com` (confirm address)
**Link Type:** Email
**Ontraport Field or Dynamic URL Source:** Static
**Display Condition:** Always visible
**Fallback Behavior:** None
**Status:** Needs URL (confirm address + whether it should be a clickable `mailto:`)
**Notes:** Source shows it as static text. Decide if it should become a clickable link.

### LNK-004 — Support phone

**Section / Component:** 02-panel — footer
**Visible Label or Purpose:** Contact support by phone
**Element Selector:** `.lm-login__foot` (text `+1 (800) 888-9590`)
**Source href / action / handler:** Plain text (not a `tel:` link)
**Required Final Destination:** `tel:+18008889590` (confirm number)
**Link Type:** Phone
**Ontraport Field or Dynamic URL Source:** Static
**Display Condition:** Always visible
**Fallback Behavior:** None
**Status:** Needs URL (confirm number + whether it should be a clickable `tel:`)
**Notes:** Source shows it as static text.

### LNK-005 — Post-login destination

**Section / Component:** Page-level (behavior after successful login)
**Visible Label or Purpose:** Where an authenticated member lands
**Element Selector:** N/A (Ontraport auth redirect)
**Source href / action / handler:** Not present in source
**Required Final Destination:** Landmark Portal member-home page on `landmark-portal.com`
**Link Type:** Native Ontraport membership redirect
**Ontraport Field or Dynamic URL Source:** Landmark Portal site membership settings (post-login destination)
**Display Condition:** After successful auth
**Fallback Behavior:** Return to login on failure
**Status:** TBD — **blocked by missing page**, not missing data
**Notes:** Set in the site's membership settings. ⚠️ As of this read, the Landmark Portal site (site_id 1) has only 3 starter/test "My Account" pages and **no member-home/dashboard page exists yet**. Build/designate that page first, then point the post-login redirect at it. Portal pages live on `landmark-portal.com`; follow the account naming convention `PORTAL : … (lp)`.

---

## B. Dynamic Content and Merge Tags

_No contact-, event-, or record-specific merge fields appear in the source._
This is a pre-authentication login screen: all visible copy is static. If the
project wants a personalized greeting after a known email, that would be a new
requirement (not in source) and is intentionally **not** invented here.

- **Status:** None required from source. Mark `N/A` unless a new requirement is added.

---

## C. Display Logic

### LOGIC-001 — Login error / invalid credentials state

**Section / Component:** 02-panel — login form
**Condition:** Authentication fails
**Data Source:** Ontraport membership login
**When True:** Show error message (e.g., "Incorrect email or password")
**When False:** Proceed to LNK-005 destination
**Implementation Layer:** Ontraport Dynamic Template / native membership login
**Fallback:** Generic error
**Status:** TBD
**Notes:** Not present in source markup; provided by Ontraport's login handling. Style any error element to match `.lm-login__subhead` / coral token `--lm-coral` if a custom error is desired.

---

## D. Interaction Relationships

### INT-001 — Input focus states (CSS-only)

**Owning Section:** 02-panel
**Component Folder:** N/A (surface-level)
**Trigger Selector:** `.lm-login__field input:focus`
**Target Selector:** same element
**Open / Close / Submit Behavior:** N/A — visual focus ring only
**Required JS File:** None
**Required Data Attributes or IDs:** `#email`, `#password`
**Keyboard Behavior:** Native tab order; visible focus ring via `box-shadow`
**Notes:** No JavaScript on this page. The only "interaction" is the CSS focus treatment and button hover/active states. `05-Master-Interactions.js` is intentionally **not** generated.

---

## Link QA Checklist (all links on page)

| ID | Location | Type | Status |
|---|---|---|---|
| LNK-001 | Login form | Native OP login | Resolved — use native login block (Landmark Portal site) |
| LNK-002 | Password help | Native OP reset | Resolved — use native reset link |
| LNK-003 | Footer email | Email | Confirm / optional `mailto:` |
| LNK-004 | Footer phone | Phone | Confirm / optional `tel:` |
| LNK-005 | Post-login redirect | Native OP redirect | TBD — member-home page not built yet |

## Verified Ontraport Context (2026-07-27 read)

| Item | Verified value |
|---|---|
| Account | 270197 (America/Los_Angeles, LM Stripe) |
| Membership site | **Landmark Portal** — site_id `1` |
| Portal domain | `landmark-portal.com` |
| Members | 108 (all active), 43 total logins |
| Existing site pages | 3 starter/test "My Account" cancellation pages only |
| Login/reset/redirect | Native Ontraport membership features (site settings UI) |
| Merge tags on this page | None (pre-auth) |
| Suggested page name | `PORTAL : Login : Member Portal Login (lp)` |
