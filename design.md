# Design Tokens

Source: [Figma — Spotify/Airbnb (Arshia, Community)](https://www.figma.com/design/TqoGNkjUfaTKaXI8q58WMH/-Spotify-Airbnb----Arshia--Community-?node-id=33-54)
Frame: `Page 6` (node `33:54`) — mobile Explore screen, dark theme, 375×812.

No Figma variables are published on this file (`get_variable_defs` → `{}`). Tokens below are extracted from raw fills, typography, and effects on the frame.

---

## Color

### Surface (dark)
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#121212` | Page background |
| `--color-surface-raised` | `#191919` | Top hero band (behind search) |
| `--color-surface-nav` | `#272828` | Bottom tab bar |
| `--color-surface-input` | `#2f2f30` | Search field pill |
| `--color-border-subtle` | `#414141` | "I'm flexible" outline button border |

### Accent
| Token | Value | Usage |
|---|---|---|
| `--color-accent-glow` | `rgba(87, 182, 95, 1)` → `rgba(87, 182, 95, 0)` | Top-left radial glow on hero |

### Category card fills
Distinct per destination card (not a reusable scale — treat as a palette).
| Token | Value | Example |
|---|---|---|
| `--color-card-blue` | `#3090c9` | Los Angeles |
| `--color-card-indigo` | `#4b6192` | Las Vegas |
| `--color-card-crimson` | `#b8364e` | San Diego |
| `--color-card-clay` | `#b98b7c` | Henderson |

### Text
| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#ffffff` | Headings, card titles, active tab |
| `--color-text-secondary` | `rgba(255, 255, 255, 0.5)` | Search placeholder, inactive tab labels |

---

## Typography

Family: **Proxima Nova** (Bold, Regular, Light). All `font-style: normal`, `line-height: normal`.

| Token | Weight | Size | Usage |
|---|---|---|---|
| `--type-section-title` | Bold | 24px | "Explore nearby", "Live anywhere" |
| `--type-hero` | Bold | 20px | "Not sure where to go? Perfect." |
| `--type-body-strong` | Bold | 16px | Card titles ("Los Angeles"), CTA ("I'm flexible") |
| `--type-body` | Regular | 16px | Search placeholder |
| `--type-caption` | Light | 14px | Card subtitle ("15 minute drive") |
| `--type-tab-label` | Regular | 11px | Bottom nav labels |

---

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-card` | 5px | Destination cards, image tiles |
| `--radius-search` | 7.5px | Search pill |
| `--radius-pill` | 86px | "I'm flexible" capsule button |

---

## Elevation / Shadow

| Token | Value | Usage |
|---|---|---|
| `--shadow-thumb` | `2px 0 5px rgba(0, 0, 0, 0.2)` | Right edge of card thumbnail |
| `--shadow-nav` | `-25px 0 15px rgba(0, 0, 0, 0.5)` | Top edge of bottom tab bar |

---

## Layout

| Token | Value | Notes |
|---|---|---|
| `--viewport-w` | 375px | Mobile frame |
| `--viewport-h` | 812px | Mobile frame |
| `--gutter` | 25px | Left/right content padding |
| `--hero-band-h` | 300px | Height of raised hero surface |
| `--search-h` | 30px | Search pill |
| `--card-h` | 70px | Destination card |
| `--card-w-sm` | 225px | Left-column destination card |
| `--card-w-lg` | 250px | Right-column destination card (overflows viewport) |
| `--tile-size` | 250px | "Live anywhere" square tiles |
| `--tab-bar-h` | 75px | Bottom nav |
| `--tab-divider-h` | 1px | Top border of tab bar |

---

## Component recipes

### Search pill (`35:24`)
- Background `--color-surface-input`, radius `--radius-search`, height `--search-h`, width `325px`.
- Placeholder `Where are you going?` — `--type-body`, color `--color-text-secondary`, centered.
- Leading search glyph inset ~10% from left.

### Destination card (`75:34` and siblings)
- Background from card palette, radius `--radius-card`, height `--card-h`.
- 70×70 thumbnail pinned left with `--shadow-thumb` on its right edge, radius `--radius-card` on right corners only.
- Title `--type-body-strong` at `left: 84px, top: 16px`, color `--color-text-primary`.
- Subtitle `--type-caption` at `left: 84px, top: 37px`, color `--color-text-primary`.

### Flexible CTA (`76:25`)
- 151.875 × 45, radius `--radius-pill`, 1px solid `--color-border-subtle`, no fill.
- Label `I'm flexible` — `--type-body-strong`, color `--color-text-primary`, centered.

### Bottom tab bar (`44:37`)
- Background `--color-surface-nav`, height `--tab-bar-h`, shadow `--shadow-nav`, 1px top divider.
- Five tabs: Explore (active), Wishlists, Trips, Inbox, Profile.
- Active label `--color-text-primary`; inactive `--color-text-secondary`.
- Label `--type-tab-label`, centered under a 20–22px icon.
