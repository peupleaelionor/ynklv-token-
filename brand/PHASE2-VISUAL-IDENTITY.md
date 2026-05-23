# YNKLV Phase 2 — Visual Identity System

> *"Design is not decoration. It is argument."*

---

## Philosophy

Phase 2 visual identity is built around a single tension:
**monumental permanence vs. living dynamism.**

YNKLV must feel old — like an institution that has existed for decades.
And it must feel alive — because it is a living ecosystem, not a static artifact.

This tension is resolved through:
- **Static structure** (grid, geometry, typography) that signals permanence
- **Motion** (fill levels, glow states, scroll parallax) that signals life
- **Restraint** — what you do NOT show matters as much as what you do

---

## Color System

### Primary Palette

| Token           | Hex       | Usage |
|---|---|---|
| `--void`        | `#070707` | Background. Not pure black — has warmth. |
| `--blanc`       | `#F6F5F1` | Primary text. Not pure white — has depth. |
| `--or`          | `#C8A45A` | The only chromatic color. Gold. Intentional. |

### Or Glow System

Or is used sparingly. When it appears, it must feel earned.

| Token           | Usage |
|---|---|
| `--or-glow-sm`  | Subtle hover states, active dots |
| `--or-glow-md`  | Focus states, achievement moments |
| `--or-glow-lg`  | Legend tier, Pass ceremony, primary CTAs |

### Opacity Ladder (Blanc)

```
--blanc       = full       → Primary text, headings
--blanc-70    = 70% opacity → Secondary text, descriptions  
--blanc-60    = 60% opacity → Body copy
--blanc-50    = 50% opacity → Supporting text
--blanc-40    = 40% opacity → Labels, captions
--blanc-35    = 35% opacity → Muted labels
--blanc-30    = 30% opacity → Hints, placeholder
--blanc-25    = 25% opacity → Very muted
--blanc-20    = 20% opacity → Almost invisible — cultural marks
--blanc-10    = 10% opacity → Dividers, borders
```

The opacity ladder creates depth without introducing new colors.
Everything is blanc — at different distances.

---

## Typography

### Typeface Roles

| Role        | Property          | Usage |
|---|---|---|
| Display     | `font-display`    | Hero headlines, YNKLV name — the commanding voice |
| Editorial   | `font-editorial`  | Section headings, pull quotes — intellectual authority |
| Prose       | `font-prose` / `t-prose` | Body copy — readable, warm, human |
| Label       | `t-label`         | ALL CAPS, tracked — system voice, never emotional |
| Numeral     | `t-numeral`       | Tabular-nums, stats — precision |

### Fluid Type Scale

All sizes use CSS `clamp()` — no breakpoint-based font switching.

```css
text-fluid-xs  → clamp(0.7rem,  1.5vw, 0.8rem)
text-fluid-sm  → clamp(0.875rem, 2vw, 1rem)
text-fluid-base→ clamp(1rem,    2.5vw, 1.125rem)
text-fluid-lg  → clamp(1.125rem, 3vw,  1.5rem)
text-fluid-xl  → clamp(1.5rem,  4vw,  2.25rem)
text-fluid-2xl → clamp(2rem,    5vw,  3.5rem)
text-fluid-3xl → clamp(2.75rem, 7vw,  5rem)
text-fluid-4xl → clamp(3.5rem,  9vw,  7rem)
```

### Typography Rules

1. **Never center long text.** Center only display headlines and labels.
2. **Never use more than 2 weights** in a single context.
3. **Tracking hierarchy:** display > label > prose. Never add tracking to body copy.
4. **Line height:** 1.02–1.05 for display. 1.7–1.8 for prose. Nothing in between.
5. **Gold text is used sparingly.** `gradient-or` class — one prominent use per section maximum.

---

## The Hexagonal Glyph

The hexagon is the YNKLV symbol. It is:

- **Mathematical:** computed from size, never approximated
- **Cultural:** references Ndebele geometric tradition, Kente structure
- **Dynamic:** fill level maps to Pass tier (0 = empty = newcomer, 1 = full = legend)
- **Animated:** rotating variant for loading states, glow for legend tier

### Glyph Variants

| Variant    | Usage |
|---|---|
| `outline`  | Default — structural, permanent |
| `filled`   | When tier progress is highlighted |
| `glow`     | Legend tier, achievement moments, primary feature areas |
| `rotating` | Loading states only — never decoration |

### Glyph Sizing

| Size | Usage |
|---|---|
| 24px | Footer wordmark companion |
| 28px | Navigation wordmark companion |
| 40px | Tier progress indicators |
| 52px | Product cards, tier columns |
| 60px | Ecosystem node cards |
| 72px | Onboarding states |
| 88px | Achievement ceremony |
| 96px | Final CTA focal point |
| 320px | Hero background — near-invisible |

---

## Motion Principles

### The Three Rules

1. **Motion must convey meaning.** An element moves because it is entering, exiting, transforming, or responding to a user action — never for decoration.
2. **Ease is identity.** `ease.silk` (`[0.16, 1, 0.3, 1]`) is the YNKLV signature. Every transition should feel like it belongs to the same organism.
3. **Reduced motion is respected.** Every animated component checks `useReducedMotion()`.

### Motion Hierarchy

| Priority | Motion Type    | Duration  | Easing |
|---|---|---|---|
| Highest  | Page enter     | 600ms     | silk   |
| High     | Section reveal | 800–1000ms | reveal |
| Medium   | Card reveal    | 500–700ms | silk   |
| Low      | Hover          | 200ms     | silk   |
| Ambient  | Glow pulse     | 2500ms∞   | easeInOut |

### Scroll-Driven Architecture

Hero background hexagon scales and fades as you scroll — creating a sense of entering the space.

The vertical Or line in ProductShowcase grows with scroll progress — tracking your journey through the content.

The stat strip at hero bottom fades in after initial load — signaling the ecosystem is live.

---

## Layout System

### Grid

12-column grid with responsive `clamp()` gutters. The `container-ynklv` class handles:

```
Width: min(100%, 1200px)
Padding: clamp(1.25rem, 5vw, 4rem)
```

### Section Rhythm

Every section uses `py-32 md:py-48` — generous vertical breathing room.
This is a monument, not a brochure. Space is part of the message.

### Dividers

Never use solid lines as dividers. Use:
- `rgba(200,164,90,0.07)` as `border` — barely visible Or
- `rgba(200,164,90,0.07)` as `background` on grid gaps — creates panel effect
- Gradient opacity lines for decorative accents

---

## UI States

### The Five Screen States

| State     | Treatment |
|---|---|
| Empty     | Glyph (fill = 0) + instructional copy — never "nothing here" |
| Loading   | HexLoader rotating — never spinner |
| Success   | HexGlyph fill = 1 + goldPulse — ceremony, not toast |
| Error     | Blanc-60 text, no red — errors are informational, not alarming |
| Locked    | Or-bordered container, dim content — respect the gate |

### Interactive States

- **Hover:** `y: -3px` lift + border color shift to Or
- **Active/Press:** `scale: 0.98` — tactile response
- **Focus:** Or-colored ring, 2px, offset 2px — accessible and branded
- **Disabled:** `opacity: 0.4` — never hidden, always informative

---

## Voice in Visual Design

Every visual decision has a corresponding tonal principle:

| Visual Decision | What it says |
|---|---|
| No price tickers on homepage | "We are not a trading platform." |
| Or used sparingly | "Gold is earned, not given." |
| Large empty space | "We are not in a hurry." |
| All-caps labels | "This is a system." |
| Display type, close tracking | "This is a statement." |
| 90% creator share on every Studio card | "We say what we mean." |
| Public treasury link in footer | "We have nothing to hide." |

---

## Anti-Patterns

Things that must never appear in YNKLV visual design:

- Price charts, candle charts, or any speculative framing
- "To the moon" language, rocket emoji, or hype-adjacent copy
- Gradient-heavy UI that feels "crypto 2021"
- Glassmorphism beyond subtle utility (the `glass` class is for functional use only)
- Confetti, pop-up celebration animations, or gamified elements
- Progress bars framed as "how much you've earned" vs. "how much you've contributed"
- More than one chromatic color (Or only. Terre Rouge reserved for critical states.)

---

## Cultural Markers

These elements appear throughout the product as identity anchors:

| Marker | Where |
|---|---|
| "TOBONGISA MBOKA" | Footer, onboarding end, dashboard footer — always in lowercase label style |
| "Not a coin. A civilization." | Hero, onboarding, manifesto |
| "Cultural Epoch 01 — GENESIS" | Dashboard, nav on launch |
| Hexagonal geometry | Navigation, hero background, cards, pass visualization |
| Or gold as the only color | Everywhere Or appears, it means something |

---

## Design Review Checklist

Before any new screen ships, check:

1. Does it have too much motion? (remove anything decorative)
2. Does Or appear more than once as the primary focus? (if yes, reduce)
3. Is there a "crypto" feeling anywhere? (redesign from scratch)
4. Would a premium fintech product designer respect this? (if not, ask why)
5. Does it feel permanent? (monuments don't use trendy UI patterns)
6. Does it respect the user's time and intelligence? (no hand-holding copy)
