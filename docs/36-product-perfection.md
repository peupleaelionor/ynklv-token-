# YNKLV — Product Perfection Standards

> *"The interface is not the product. The product is the feeling of being respected."*

**Phase 3 · Part 7 — Product Perfection.**
Every interaction in the YNKLV ecosystem must feel emotionally intelligent, calm,
elite, minimal, and effortless. This document is the standard. Nothing ships
that does not pass it.

---

## 1 — The Product Philosophy

YNKLV is built on calm technology. The best interface is the one that asks the
least of the person using it — the least attention, the least patience, the least
proof that they belong. We are designing for someone on a 3G connection in
Kinshasa as carefully as for someone on fibre in Paris. The standard does not bend
for the constraint. The product earns its elegance under the constraint.

Three commitments govern every screen:

**Respect the user's time.** Nothing loads slowly. Nothing asks twice. Nothing
makes a person wait for a result we could have predicted. Speed is not a feature —
it is a form of respect.

**Respect the user's intelligence.** We do not explain what is obvious. We do not
celebrate what is ordinary. We do not manufacture emotion the moment does not
contain. A person who arrives at YNKLV is treated as a builder of a civilization,
not a user to be converted.

**The interface disappears.** When a product is right, the person forgets they are
using software. They are minting their Pass, casting their vote, releasing their
work. The chrome recedes. The action remains. Our highest praise for a screen is
that no one noticed the screen.

> Reference class: Apple's restraint, Stripe's clarity, Linear's speed, Arc's
> opinionated calm, the Ethereum Foundation's institutional sobriety. We borrow
> from all and imitate none.

---

## 2 — Standards by Surface

Each surface in the ecosystem carries the YNKLV name. Each is held to a written
standard. The named layers — **Mboka** (protocol), **The Indaba** (governance),
**Baraka** (treasury), **Nommo** (intelligence), **Soko** (creator economy),
**Sankofa** (identity) — appear consistently in every interface. The vocabulary
of the institution is part of the product.

### 2.1 — Onboarding: The Five-Step Ceremony

Onboarding is not a funnel. It is a ceremony of arrival. A person becomes a
citizen of YNKLV exactly once, and the moment should feel that way — dignified,
unhurried, irreversible in the right way. Five steps, no more.

```
  WELCOME  →  CONNECT  →  QUALIFY  →  MINT  →  COMPLETE
     ·          ·           ·          ·         ·
  "What        Wallet     Sankofa    The Pass   Citizen
   this is"    or         checks     is minted  of Mboka
               mobile     standing   on Base
               money
```

| Step | Purpose | The standard |
| --- | --- | --- |
| Welcome | State what YNKLV is, once, plainly | One screen. No carousel. No video autoplay. The person decides to continue or leave with full information. |
| Connect | Bind a wallet or mobile-money identity | Both paths equal in prominence. Mobile money is not the lesser option. No jargon ("seed phrase") before it is needed. |
| Qualify | Sankofa confirms eligibility for tier | The check is shown, not hidden. A person sees why they qualify for Newcomer and what earns the next tier. |
| Mint | The Pass (ERC-721) is written to Base | Gas is abstracted — the person never sees a gas fee in their currency of confusion. Failure states are recoverable, never terminal. |
| Complete | The hexagonal glyph fills to first tier | One quiet animation, silk easing, once. No confetti. The glyph filling *is* the celebration. |

The ceremony must complete in under 90 seconds on a mid-range Android phone over
3G, excluding chain confirmation, which proceeds in the background with the person
already inside.

### 2.2 — Wallet Systems

The wallet is the most sensitive surface we own. It holds value, and on the
continent value is trust earned slowly and lost instantly.

- **Mobile-first by construction.** The primary wallet is a PWA. It works offline
  for read operations, queues writes, and reconciles when connectivity returns.
- **Mobile-money aware.** Orange Money, Wave, and MTN are first-class on-ramps and
  off-ramps, presented in the person's local currency, not in token abstractions
  they must mentally convert.
- **Gas abstraction is mandatory.** No person should hold a separate gas asset to
  use YNKLV. Transactions are sponsored or paid in-token via account abstraction.
  The phrase "you need ETH for gas" must never appear in a YNKLV interface.
- **Balance honesty.** Show the value, the recent movement, and what is pending.
  Never show a speculative projection. Never show a price chart by default.

### 2.3 — Governance Interfaces: The Indaba

Governance is where most ecosystems become hostile to ordinary people — walls of
proposal text, quorum jargon, intimidating finality. The Indaba must make
participation dignified.

- **Proposals** read like editorial documents, not contracts. A summary in four
  languages sits above the technical detail. The technical detail is one click
  away, never removed.
- **Voting** is a single, deliberate act. The interface confirms what the vote
  means in plain language before it is cast, and shows the standing of the vote
  without a live ticker that pressures the moment.
- **Delegation** is presented as an act of trust, not abdication. A person sees who
  they delegate to, what that delegate has voted, and can revoke at any time
  without penalty.
- **The Governance Mark.** A person's first vote is recorded as a ritual moment
  (see Cultural Legacy). The interface marks it once and never gamifies it after.

### 2.4 — Creator Systems: Soko and YNKLV Studio

**Soko** is the creator economy; **YNKLV Studio** is its application. The split is
fixed and shown without apology: **90% creator · 8.5% commons · 1.5% burned.**

- The creator sees their 90% as the headline number, in local currency, before any
  abstraction. The 8.5% to **Baraka** and the 1.5% burn are shown as transparent
  line items, not buried.
- Publishing a work must feel like releasing it into the world, not uploading to a
  platform. The First Creation is a recognized ritual moment for new creators.
- Payouts are immediate and visible on the **Zamani Ledger**. A creator can trace
  any sale to its on-chain record. Trust is not asserted; it is verifiable.
- Nommo faculties (Eké/Writer, Oro/Visual, Bassa/Audio) assist creation but never
  author it silently. AI assistance is labelled, optional, and never the default
  voice of a person's work.

### 2.5 — Ecosystem Dashboards: Sankofa and the Pass

The dashboard is the mirror in which a person sees their standing in the
civilization. It must be honest and calm.

- **EPS (Ecosystem Participation Score)** is shown as a state of contribution, not
  a leaderboard rank. We show what a person has done and what the next contribution
  unlocks. We do not pit citizens against each other.
- **The Pass** displays the hexagonal glyph filled to the person's tier:
  Newcomer → Member → Builder → Architect → Legend. The fill level *is* the status
  display. No badges, no streak counters, no manufactured progress bars.
- **The Contribution Lattice** visualizes a person's real history — votes,
  creations, delegations, founding marks — drawn from the Zamani Ledger.

### 2.6 — Baraka Treasury Transparency

**Baraka** is the commons treasury. Its interface is a public accountability
surface, not a marketing dashboard.

- Inflows, outflows, holdings, and grants are shown in full, updated from chain.
- Every grant funded by Baraka links to its proposal in the Indaba and its
  outcome. Money has a story, and the story is visible.
- No projections, no "treasury value at target price." Present capital, present
  facts. The treasury earns trust by being legible, not impressive.

---

## 3 — Interaction Principles

### 3.1 — Motion Hierarchy

Motion must convey meaning, never decoration. There are exactly three permitted
roles for motion, and a screen should rarely use more than one at a time.

| Tier | Role | Example | Constraint |
| --- | --- | --- | --- |
| 1 — Orientation | Show where a thing came from / went | A panel sliding from the edge it lives on | ≤ 240ms, silk easing |
| 2 — Confirmation | Acknowledge a completed action | The glyph filling on Pass mint | Once, never looped |
| 3 — Continuity | Maintain spatial logic across views | Shared-element transition between list and detail | ≤ 320ms |

The signature easing is **silk** — `cubic-bezier(0.16, 1, 0.3, 1)` — for all
entrance and continuity motion. Anything that does not orient, confirm, or
maintain continuity does not move.

### 3.2 — The Five Screen States

Every screen accounts for five states. Most products design only the success
state and improvise the rest. We design all five with equal restraint.

```
  EMPTY      A calm invitation, never an apology. States what could be here
             and the one action that begins it. No illustration clutter.

  LOADING    Skeletons that match final layout, never spinners that imply
             uncertainty. On slow networks, show progress honestly.

  SUCCESS    Quiet confirmation. The glyph, a line of text, silk motion once.
             Never a celebration disproportionate to the act.

  ERROR      Plain language, a cause if known, and a way forward. Never a dead
             end. Never blame the person. Recoverable by default.

  LOCKED     Dignified gating. Shows what is locked, why, and what earns access
             — through Sankofa standing, never through payment-to-unlock.
```

### 3.3 — Accessibility

Accessibility is not a compliance task. It is the same commitment to respect,
extended to everyone.

- **WCAG 2.2 AA** minimum across all surfaces. Or/gold on Void Black and Blanc
  combinations are validated for contrast; gold is never load-bearing for meaning
  on its own.
- **Reduced motion** is honoured fully. With `prefers-reduced-motion`, all Tier 1–3
  motion resolves to instant state changes. No information lives only in motion.
- **Low-literacy support.** Critical paths (onboarding, payment, voting) carry
  iconographic and, where possible, audio support. No critical action depends on
  reading dense text.
- **Multilingual by default** — French, English, Swahili, Lingala — with no
  language treated as a translation afterthought. Lingala and Swahili strings are
  authored, not machine-rendered, for the moments that carry cultural weight.

### 3.4 — Performance Budgets for Low-Bandwidth Africa

The product is designed for the hardest connection, then it is fast everywhere.

| Metric | Target (mid-range Android, throttled 3G) | Hard ceiling |
| --- | --- | --- |
| First Contentful Paint | ≤ 1.8s | 2.5s |
| Time to Interactive | ≤ 3.5s | 5.0s |
| Largest Contentful Paint | ≤ 2.5s | 4.0s |
| Initial JS payload (gzipped) | ≤ 130KB | 170KB |
| Initial route total transfer | ≤ 300KB | 400KB |
| Cumulative Layout Shift | ≤ 0.05 | 0.1 |

- The core flows function as a **PWA**, installable, offline-tolerant, and resilient
  to dropped connections mid-transaction.
- Images are served responsively and lazily; the gold glyph is an inline SVG, never
  a raster asset.
- A screen that cannot meet the hard ceiling on 3G is not done. It is rescoped.

---

## 4 — The Product Review Checklist

No screen ships until a reviewer can answer yes to every line. This is a gate, not
a guideline.

```
□  Does it state its purpose in one sentence without jargon?
□  Are all five screen states (empty/loading/success/error/locked) designed?
□  Does every error offer a way forward and avoid blaming the person?
□  Is gas fully abstracted? Is mobile money a first-class path where relevant?
□  Does motion only orient, confirm, or maintain continuity — using silk easing?
□  Does it honour prefers-reduced-motion with no loss of information?
□  Does it meet WCAG 2.2 AA, including gold-on-dark contrast?
□  Is it authored in FR/EN/SW/Lingala for all cultural-weight moments?
□  Does it meet the 3G performance budget (FCP ≤ 1.8s, JS ≤ 130KB)?
□  Is the named layer (Mboka/Indaba/Baraka/Nommo/Soko/Sankofa) used correctly?
□  Does the celebration match the act — no manufactured emotion?
□  Could a skeptical, intelligent adult use this and feel respected?
□  Would it survive next to Apple, Stripe, Linear without embarrassment?
```

If any line is no, the screen returns to design. There is no expedited path
around the gate.

---

## 5 — Anti-Patterns

These are forbidden. They are not matters of taste; they are matters of identity.

- **No gamified confetti.** No streaks, no celebration animations disproportionate
  to the act, no dopamine engineering. The glyph filling is the only reward
  language we use, and it is earned.
- **No dark patterns.** No pre-checked boxes, no buried opt-outs, no confirm-shaming
  ("No, I don't want to grow"), no roach motels. Leaving is as easy as joining.
- **No manufactured urgency.** No countdown timers, no "only 3 left," no "early
  access ends soon," no fake scarcity. The supply is fixed at 1B and immutable;
  scarcity is real and never theatrical.
- **No crypto-2021 aesthetics.** No neon gradients, no rocket motifs, no
  laser-eyes energy, no price tickers as decoration, no "to the moon" anything.
  YNKLV looks like an institution that intends to exist in 2050.
- **No speculation surfacing.** Price is not a default view. We do not show
  projections, APY promises, or "potential returns." Utility before speculation —
  in the architecture and on the screen.

---

## 6 — The Standard, Restated

Calm technology. Respect for time and intelligence. An interface that disappears.
Five states, three motions, four languages, one easing curve. A performance budget
written for the hardest connection on the continent and met everywhere else without
trying. A review gate that no screen escapes.

We are not building screens. We are building the surfaces of a civilization that
intends to last decades. Every pixel is held to that horizon.

---

*Zamani Foundation*
*Cultural Epoch 03 — EXPANSION*

> *"Effortless is the hardest thing to build. Build it anyway."*
