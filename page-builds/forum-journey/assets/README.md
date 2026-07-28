# Forum Journey — Image Assets

Local asset library extracted from `forum-journey.html`. All filenames use the
`lm-fj-` prefix and are named for the page section / element where the image is used.

| Filename | Page Section / Element | Format | Dimensions | Source |
| --- | --- | --- | --- | --- |
| `lm-fj-nav-logo.png` | Top nav — "Landmark" logo | PNG | 1200×300 | Base64 decoded (identical to `member-portal-during/assets/mpd-nav-logo.png`) |
| `lm-fj-prepare-calendar.jpg` | Get Ready cards — "Add to Your Calendar" | JPEG | 760×819 | Base64 decoded |
| `lm-fj-prepare-tech-check.jpg` | Get Ready cards — "Tech Check" | JPEG | 760×427 | Base64 decoded |
| `lm-fj-prepare-info-form.jpg` | Get Ready cards — "Complete Your Information Form" (Action needed) | JPEG | 760×410 | Base64 decoded |
| `lm-fj-come-ready.jpg` | Notes section — "come ready to engage" (`.g-note`) | JPEG | 1192×644 | Base64 decoded |
| `lm-fj-portal-preview.jpg` | Member Portal preview — login screen (`.portal-shot`) | JPEG | 1120×1288 | Base64 decoded |
| `lm-fj-schedule-forum-logo.png` | Your Schedule — "The Landmark Forum" format logo | PNG | 1536×589 | Base64 decoded (identical to `member-portal-during/assets/landmark-forum-logo.png`) |
| `lm-fj-graduation-night.jpg` | Your Schedule — "The Graduation Evening" (`.gradnight`) | JPEG | 856×581 | Base64 decoded |

## Remote images referenced but not bundled

Two decorative background images are loaded from Unsplash at runtime (each has an
`onerror` fallback that hides the element if the request fails). They could not be
downloaded into this library because the session's egress policy blocks
`images.unsplash.com`:

| Element | URL |
| --- | --- |
| Hero background (`.hero .bg`) | `https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=2400&q=80` |
| "Create possibility" photo (`.create-photo`) | `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80` |
