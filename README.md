# LWW — Landmark Worldwide page builds

Front-end source for the Landmark pages hosted in **Ontraport**. Each page is
built from hand-written HTML/CSS/JS that gets pasted into Ontraport's page
builder, so this repo — not Ontraport — is where the readable source lives.

> **This repository is public.** Nothing here may contain participant data,
> credentials, or API keys. See [Before you commit](#before-you-commit).

## How a page build is laid out

Every folder under `page-builds/` follows the same shape. `[page-title]/` is the
empty template to copy when starting a new one.

```
page-builds/<page>/
  about-page           what the page is, who sees it, where it lives in Ontraport
  structure-map        section-by-section map, gotchas, known issues — read this first
  design-system.css    fonts + :root tokens + global typography
  master.css           the whole page stylesheet, paste-ready
  assets/              images referenced by the page
  sections/
    1-<name>/
      1-<name>.html    the block pasted into one Ontraport Custom HTML element
      1-<name>.css     that section's styles (also present inside master.css)
      1-<name>.js      that section's script
      popups/          modals triggered from this section, same 3-file shape
  source html design file.html   the original design mockup, before Ontraport
  source-stylesheet.css          the designer's original stylesheet
```

Sections are numbered in **page order**, and that number is part of the folder
and file name so a section sorts next to its own assets.

`master.css` is the file that actually ships — the per-section `.css` files are
the same rules kept separately so they are readable and diffable. If you change
one, change the other.

### Current builds

| Build | Page |
|---|---|
| `page-builds/forum-journey/` | Pre-event page for registered Forum participants |
| `page-builds/member-portal-during/` | Logged-in member hub for the weekend of the Forum |
| `page-builds/member-portal-login/` | Member Portal login screen |
| `page-builds/[page-title]/` | Empty template — copy this to start a new build |

### Standalone scripts

Small behaviours pasted into individual Ontraport pages, not tied to a build:

| File | What it does |
|---|---|
| `ac-choose-dates.js` | Advanced Course "Choose Your Dates" — date selection + confirm modal |
| `disable-confirm-email-paste.js` | Blocks paste into Confirm Email fields, with an inline error |
| `sms-formatting.js` | Live NANP phone formatting as the user types |
| `portal-pre-event.css` | Stylesheet for the portal pre-event page |

## Things that bite you in Ontraport

**Merge fields resolve in attributes.** `[Page//Some Field]` works inside an
`href`, not only in text. Some older comments in this repo claim otherwise —
they are wrong. Pages still carry a hidden `.lm-fj-mf` / merge-feed block for
values that JavaScript needs to read, since reading a text node is reliable.

**Merge context is the page's object.** On a personalised page, `[Page//X]`
resolves against that object's record — for the Forum Journey page that is a
Registration (Ontraport object `10001`), and `[Page//Contact//X]` hops to its
contact. A registration's `unique_id` and its contact's `unique_id` are
different values, so never hand-build a personalised URL; merge the stored URL
field instead.

**Checkbox fields merge as words.** A checkbox stored as `1` merges into the
page as `"Yes"`. Match on `Yes`/`No`, not `1`/`0`.

**The custom-code sanitizer will reject your JavaScript.** Saving Footer Code
fails with *"Some of the custom html seems suspicious and cannot be saved"* if
the script contains any of:

- `sessionStorage` / `localStorage`
- `new URLSearchParams(location.search)`
- `setAttribute("href", …)`
- literal `https://` URLs

`removeAttribute("href")` is fine — it removes rather than writes. Get links
into the page via a merge field in the HTML so the script never needs a URL.

**Ontraport strips some pasted tags** and injects blocks after first paint, so
page scripts re-run themselves on a short timer rather than assuming the DOM is
final at `DOMContentLoaded`.

## Before you commit

This repo is public and these pages are personalised, so the failure mode is
leaking a real participant.

- **Never paste a rendered page in here.** A live page has every merge field
  already resolved — a scrape carries someone's name, email and phone with it.
  Export blocks from the Ontraport page builder with `[Page//…]` tags intact.
- **No credentials.** Keys belong in `PropertiesService` (Apps Script) or an
  env var, never in a committed file.
- Asset URLs from `file.ontraport.com` carry a signature but are already public
  on the live page, so they are fine to commit.

## Related

`co-labs-builds/landmark-new-era` — the working repo for this project:
Ontraport architecture docs, automation specs, Apps Script tooling and the
portal/dashboard engines. Page-build source lives here in LWW; that repo holds
the surrounding system.
