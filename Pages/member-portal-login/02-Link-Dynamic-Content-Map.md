# Link & Dynamic Content Map — Member Portal Login

**Page Slug:** `member-portal-login`
**Destination:** `LWW/Pages/member-portal-login/`

> **Ontraport read access was NOT available at build time** (connector not
> enabled in this chat). No merge tags, field IDs, form actions, or URLs are
> invented. Every dynamic value below is preserved from source and marked
> `TBD` / `Needs …`. Resolve each in Ontraport before publishing to members.

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
**Required Final Destination:** Ontraport membership login / member-area authentication
**Link Type:** JavaScript Action / Native Ontraport form
**Ontraport Field or Dynamic URL Source:** Ontraport membership site login (SmartForm or member login block) — **TBD**
**Display Condition:** Always visible
**Fallback Behavior:** On failed auth, show Ontraport's login error state
**Status:** TBD (Needs Logic)
**Notes:** Recommended approach — replace this static `<form>` with Ontraport's native membership login form so session/auth is handled by Ontraport, OR wire the inputs (`#email`, `#password`) to the membership login endpoint. Do not ship `onsubmit="return false;"`.

### LNK-002 — "Password help" link

**Section / Component:** 02-panel — help block
**Visible Label or Purpose:** First-time setup / forgot-password recovery
**Element Selector:** `.lm-login__help a`
**Source href / action / handler:** `href="#"` (placeholder)
**Required Final Destination:** Ontraport password-reset / account-setup URL
**Link Type:** Static (likely) or Dynamic
**Ontraport Field or Dynamic URL Source:** Ontraport password-reset page URL — **TBD**
**Display Condition:** Always visible
**Fallback Behavior:** None
**Status:** Needs URL
**Notes:** Confirm whether first-time members and returning members use the same recovery URL.

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
**Required Final Destination:** Member portal home / dashboard URL
**Link Type:** Dynamic (Ontraport membership redirect)
**Ontraport Field or Dynamic URL Source:** Ontraport membership settings — **TBD**
**Display Condition:** After successful auth
**Fallback Behavior:** Return to login on failure
**Status:** TBD
**Notes:** Configured in Ontraport membership/login settings, not in page markup.

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
| LNK-001 | Login form | Action | TBD |
| LNK-002 | Password help | URL | Needs URL |
| LNK-003 | Footer email | Email | Confirm |
| LNK-004 | Footer phone | Phone | Confirm |
| LNK-005 | Post-login redirect | Dynamic | TBD |
