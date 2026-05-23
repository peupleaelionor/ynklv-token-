# YNKLV Design System

## The Complete Visual & Interaction Language

---

## 1 — DESIGN TOKENS

### Color Tokens

```css
/* globals.css — YNKLV Design Tokens */
:root {
  /* ─── CORE PALETTE ─────────────────────────────── */

  /* Void Black — primary surface, primary text on light */
  --color-void:          #080808;
  --color-void-90:       rgba(8, 8, 8, 0.9);
  --color-void-70:       rgba(8, 8, 8, 0.7);
  --color-void-40:       rgba(8, 8, 8, 0.4);
  --color-void-10:       rgba(8, 8, 8, 0.1);

  /* Blanc Absolu — warm white, light surfaces */
  --color-blanc:         #F5F4F0;
  --color-blanc-90:      rgba(245, 244, 240, 0.9);
  --color-blanc-70:      rgba(245, 244, 240, 0.7);
  --color-blanc-40:      rgba(245, 244, 240, 0.4);
  --color-blanc-10:      rgba(245, 244, 240, 0.1);

  /* Or Profond — matte gold, primary accent */
  --color-or:            #C9A84C;
  --color-or-dark:       #9E7E33;
  --color-or-light:      #DFC06E;
  --color-or-10:         rgba(201, 168, 76, 0.1);
  --color-or-20:         rgba(201, 168, 76, 0.2);

  /* ─── SECONDARY PALETTE ─────────────────────────── */

  /* Terre Rouge — earth, origin, warning */
  --color-terre:         #8B2E16;
  --color-terre-light:   #B84020;

  /* Nuit Profonde — deep background, cosmos */
  --color-nuit:          #1A1A2E;
  --color-nuit-light:    #252545;

  /* Émeraude du Sahel — growth, success, positive */
  --color-emeraude:      #2D5E40;
  --color-emeraude-light:#3D7E56;

  /* ─── SEMANTIC TOKENS ───────────────────────────── */
  --color-bg-primary:    var(--color-void);
  --color-bg-secondary:  #111111;
  --color-bg-surface:    #161616;
  --color-bg-elevated:   #1C1C1C;

  --color-text-primary:  var(--color-blanc);
  --color-text-secondary:rgba(245, 244, 240, 0.7);
  --color-text-tertiary: rgba(245, 244, 240, 0.4);
  --color-text-disabled: rgba(245, 244, 240, 0.2);

  --color-border-subtle: rgba(245, 244, 240, 0.06);
  --color-border-default:rgba(245, 244, 240, 0.12);
  --color-border-strong: rgba(245, 244, 240, 0.24);

  --color-accent-primary:var(--color-or);
  --color-accent-hover:  var(--color-or-light);
  --color-accent-muted:  var(--color-or-10);

  --color-success:       var(--color-emeraude);
  --color-danger:        var(--color-terre);
  --color-info:          var(--color-nuit-light);
}

/* Light mode override (secondary theme) */
[data-theme="light"] {
  --color-bg-primary:    var(--color-blanc);
  --color-bg-secondary:  #EEEDE9;
  --color-bg-surface:    #E8E7E3;
  --color-bg-elevated:   #DDDCD8;

  --color-text-primary:  var(--color-void);
  --color-text-secondary:rgba(8, 8, 8, 0.7);
  --color-text-tertiary: rgba(8, 8, 8, 0.4);

  --color-border-subtle: rgba(8, 8, 8, 0.06);
  --color-border-default:rgba(8, 8, 8, 0.12);
  --color-border-strong: rgba(8, 8, 8, 0.24);
}
```

---

### Typography Tokens

```css
:root {
  /* ─── TYPE SCALE ────────────────────────────────── */
  --font-display:        'YNKLV Geometric', 'Inter', sans-serif;
  --font-body:           'Neue Haas Grotesk', 'Inter', system-ui, sans-serif;
  --font-editorial:      'Cormorant Garamond', 'Georgia', serif;
  --font-mono:           'JetBrains Mono', 'Fira Code', monospace;

  /* Scale */
  --text-xs:    0.75rem;   /* 12px */
  --text-sm:    0.875rem;  /* 14px */
  --text-base:  1rem;      /* 16px */
  --text-lg:    1.125rem;  /* 18px */
  --text-xl:    1.25rem;   /* 20px */
  --text-2xl:   1.5rem;    /* 24px */
  --text-3xl:   1.875rem;  /* 30px */
  --text-4xl:   2.25rem;   /* 36px */
  --text-5xl:   3rem;      /* 48px */
  --text-6xl:   3.75rem;   /* 60px */
  --text-7xl:   4.5rem;    /* 72px */
  --text-8xl:   6rem;      /* 96px */
  --text-9xl:   8rem;      /* 128px */

  /* Line heights */
  --leading-none:    1;
  --leading-tight:   1.1;
  --leading-snug:    1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;

  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight:   -0.025em;
  --tracking-normal:   0;
  --tracking-wide:     0.025em;
  --tracking-wider:    0.05em;
  --tracking-widest:   0.1em;

  /* Weights */
  --weight-light:   300;
  --weight-normal:  400;
  --weight-medium:  500;
  --weight-semi:    600;
  --weight-bold:    700;
}
```

---

### Spacing & Layout Tokens

```css
:root {
  /* ─── SPACING SCALE ─────────────────────────────── */
  --space-0:    0;
  --space-1:    0.25rem;   /* 4px  */
  --space-2:    0.5rem;    /* 8px  */
  --space-3:    0.75rem;   /* 12px */
  --space-4:    1rem;      /* 16px */
  --space-5:    1.25rem;   /* 20px */
  --space-6:    1.5rem;    /* 24px */
  --space-8:    2rem;      /* 32px */
  --space-10:   2.5rem;    /* 40px */
  --space-12:   3rem;      /* 48px */
  --space-16:   4rem;      /* 64px */
  --space-20:   5rem;      /* 80px */
  --space-24:   6rem;      /* 96px */
  --space-32:   8rem;      /* 128px */
  --space-40:   10rem;     /* 160px */
  --space-48:   12rem;     /* 192px */

  /* ─── LAYOUT ────────────────────────────────────── */
  --container-sm:   640px;
  --container-md:   768px;
  --container-lg:   1024px;
  --container-xl:   1280px;
  --container-2xl:  1536px;

  --gutter-mobile:  var(--space-6);
  --gutter-tablet:  var(--space-8);
  --gutter-desktop: var(--space-12);

  /* ─── ELEVATION ─────────────────────────────────── */
  --shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:   0 4px 16px rgba(0,0,0,0.5);
  --shadow-lg:   0 12px 48px rgba(0,0,0,0.6);
  --shadow-xl:   0 24px 80px rgba(0,0,0,0.7);
  --shadow-or:   0 0 24px rgba(201, 168, 76, 0.15);
  --shadow-or-lg:0 0 48px rgba(201, 168, 76, 0.25);

  /* ─── RADIUS ────────────────────────────────────── */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* ─── MOTION ────────────────────────────────────── */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-instant:  50ms;
  --duration-fast:    150ms;
  --duration-normal:  300ms;
  --duration-slow:    500ms;
  --duration-slower:  700ms;
  --duration-cinematic:1200ms;
}
```

---

## 2 — TAILWIND CONFIGURATION

```typescript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void:     '#080808',
        blanc:    '#F5F4F0',
        or: {
          DEFAULT: '#C9A84C',
          dark:    '#9E7E33',
          light:   '#DFC06E',
        },
        terre:    '#8B2E16',
        nuit: {
          DEFAULT: '#1A1A2E',
          light:   '#252545',
        },
        emeraude: {
          DEFAULT: '#2D5E40',
          light:   '#3D7E56',
        },
        surface: {
          1: '#111111',
          2: '#161616',
          3: '#1C1C1C',
          4: '#222222',
        },
      },
      fontFamily: {
        display:   ['YNKLV Geometric', 'Inter', 'sans-serif'],
        body:      ['Neue Haas Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        editorial: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono:      ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        display:  '-0.04em',
        headline: '-0.02em',
      },
      animation: {
        'rise':         'rise 0.6s var(--ease-out) forwards',
        'fade-in':      'fadeIn 0.4s var(--ease-out) forwards',
        'shimmer':      'shimmer 2s linear infinite',
        'pulse-or':     'pulseOr 3s ease-in-out infinite',
        'expand-hex':   'expandHex 0.8s var(--ease-out) forwards',
      },
      keyframes: {
        rise: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        pulseOr: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(201,168,76,0.1)' },
          '50%':      { boxShadow: '0 0 32px rgba(201,168,76,0.3)' },
        },
        expandHex: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-void': 'linear-gradient(180deg, #080808 0%, #1A1A2E 100%)',
        'gradient-or':   'linear-gradient(135deg, #C9A84C 0%, #9E7E33 100%)',
        'shimmer-or':    'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)',
        'noise':         "url('/noise.svg')",
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 3 — COMPONENT LIBRARY

### The Token Balance Card

```tsx
// packages/ui/src/TokenBalanceCard.tsx
import { formatUnits } from 'viem'
import { useBalance } from 'wagmi'

interface TokenBalanceCardProps {
  address: `0x${string}`
  eps: number
  passTier: 'newcomer' | 'member' | 'builder' | 'architect' | 'legend'
}

export function TokenBalanceCard({ address, eps, passTier }: TokenBalanceCardProps) {
  const { data } = useBalance({ address, token: YNKLV_TOKEN_ADDRESS })

  const formatted = data
    ? Number(formatUnits(data.value, 18)).toLocaleString('en', {
        maximumFractionDigits: 2,
      })
    : '—'

  return (
    <div className="
      relative overflow-hidden
      bg-surface-2 border border-white/[0.06]
      rounded-2xl p-8
      transition-shadow duration-500
      hover:shadow-or
    ">
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      {/* Header */}
      <p className="
        text-xs tracking-widest uppercase
        text-blanc/40 font-body font-light
        mb-6
      ">
        YNKLV Balance
      </p>

      {/* Primary balance */}
      <div className="mb-8">
        <span className="
          font-display text-7xl font-bold
          text-blanc tracking-display
          leading-none
        ">
          {formatted}
        </span>
        <span className="
          ml-3 text-xl font-body font-light
          text-blanc/40 tracking-wide
        ">
          YNKLV
        </span>
      </div>

      {/* EPS Meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-blanc/40 uppercase tracking-widest">
            EPS Score
          </span>
          <span className="text-sm font-medium text-or">
            {eps.toLocaleString()}
          </span>
        </div>
        <div className="h-px bg-white/[0.06] relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-or transition-all duration-700"
            style={{ width: `${Math.min((eps / 2500) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Pass tier */}
      <div className="flex items-center gap-2">
        <PassTierDot tier={passTier} />
        <span className="text-xs text-blanc/60 capitalize tracking-wide">
          {passTier}
        </span>
      </div>
    </div>
  )
}

function PassTierDot({ tier }: { tier: string }) {
  const colors = {
    newcomer:  'bg-blanc/20',
    member:    'bg-blanc/50',
    builder:   'bg-or/80',
    architect: 'bg-or animate-pulse-or',
    legend:    'bg-gradient-or animate-pulse-or',
  }

  return (
    <span className={`
      inline-block w-1.5 h-1.5 rounded-full
      ${colors[tier as keyof typeof colors] ?? 'bg-blanc/20'}
    `} />
  )
}
```

---

### The YNKLV Pass NFT Renderer

```tsx
// packages/ui/src/PassRenderer.tsx
import { useMemo } from 'react'

interface PassData {
  tokenId: number
  tier: 'newcomer' | 'member' | 'builder' | 'architect' | 'legend'
  genesisTimestamp: number
  reputationScore: number
  epochsLived: number
  city?: string
}

export function PassRenderer({ pass }: { pass: PassData }) {
  const { fillLevel, strokeColor, glowIntensity } = useMemo(() => {
    const levels = {
      newcomer:  { fill: 0.1, stroke: '#F5F4F0', glow: 0 },
      member:    { fill: 0.35, stroke: '#F5F4F0', glow: 0 },
      builder:   { fill: 0.65, stroke: '#C9A84C', glow: 0.3 },
      architect: { fill: 0.85, stroke: '#C9A84C', glow: 0.6 },
      legend:    { fill: 1.0,  stroke: '#DFC06E', glow: 1.0 },
    }
    return levels[pass.tier]
  }, [pass.tier])

  const age = Math.floor(
    (Date.now() - pass.genesisTimestamp * 1000) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="
      relative w-64 h-96
      bg-surface-2 border border-white/[0.08]
      rounded-3xl overflow-hidden
      flex flex-col items-center justify-between
      p-6
    "
    style={{
      boxShadow: glowIntensity > 0
        ? `0 0 ${glowIntensity * 60}px rgba(201,168,76,${glowIntensity * 0.3})`
        : undefined
    }}>
      {/* Background geometric */}
      <div className="absolute inset-0 opacity-5">
        <HexagonPattern fill={fillLevel} />
      </div>

      {/* Header */}
      <div className="w-full z-10">
        <p className="text-xs tracking-widest uppercase text-blanc/30">
          YNKLV Pass
        </p>
        <p className="text-xs text-blanc/30">
          #{String(pass.tokenId).padStart(6, '0')}
        </p>
      </div>

      {/* Central hexagon */}
      <div className="z-10 flex flex-col items-center gap-4">
        <HexagonGlyph
          fill={fillLevel}
          stroke={strokeColor}
          size={80}
        />
        <div className="text-center">
          <p className={`
            text-lg font-display font-bold capitalize tracking-wide
            ${pass.tier === 'legend' || pass.tier === 'architect'
              ? 'text-or'
              : 'text-blanc'
            }
          `}>
            {pass.tier}
          </p>
          {pass.city && (
            <p className="text-xs text-blanc/40 mt-1">{pass.city}</p>
          )}
        </div>
      </div>

      {/* Stats footer */}
      <div className="w-full z-10 grid grid-cols-3 gap-2">
        <Stat label="Days" value={age} />
        <Stat label="Rep" value={pass.reputationScore} />
        <Stat label="Epochs" value={pass.epochsLived} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-blanc">
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-blanc/30 uppercase tracking-widest">
        {label}
      </p>
    </div>
  )
}

function HexagonGlyph({
  fill,
  stroke,
  size,
}: {
  fill: number
  stroke: string
  size: number
}) {
  const h = size * 0.866
  const points = [
    [size / 2, 0],
    [size, h / 4],
    [size, (h * 3) / 4],
    [size / 2, h],
    [0, (h * 3) / 4],
    [0, h / 4],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(' ')

  return (
    <svg width={size} height={size * 0.866} viewBox={`0 0 ${size} ${size * 0.866}`}>
      <defs>
        <clipPath id={`fill-clip-${size}`}>
          <rect x="0" y={size * 0.866 * (1 - fill)} width={size} height={size * 0.866} />
        </clipPath>
      </defs>
      {/* Base outline */}
      <polygon
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Filled portion */}
      <polygon
        points={points}
        fill={stroke}
        opacity="0.15"
        clipPath={`url(#fill-clip-${size})`}
      />
      {/* Bright outline */}
      <polygon
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        opacity={fill}
      />
    </svg>
  )
}

function HexagonPattern({ fill }: { fill: number }) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <pattern id="hex-bg" width="30" height="26" patternUnits="userSpaceOnUse">
        <polygon
          points="15,0 30,7 30,19 15,26 0,19 0,7"
          fill="none"
          stroke="#F5F4F0"
          strokeWidth="0.5"
          opacity={fill * 0.8}
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#hex-bg)" />
    </svg>
  )
}
```

---

### Primary Button

```tsx
// packages/ui/src/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2
   font-body font-medium tracking-wide
   transition-all duration-300
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or/50
   disabled:opacity-40 disabled:pointer-events-none`,
  {
    variants: {
      variant: {
        primary: `
          bg-or text-void
          hover:bg-or-light
          active:scale-[0.98]
          shadow-sm hover:shadow-or
        `,
        secondary: `
          border border-white/12
          text-blanc
          hover:border-white/24 hover:bg-white/[0.04]
          active:scale-[0.98]
        `,
        ghost: `
          text-blanc/70
          hover:text-blanc hover:bg-white/[0.04]
        `,
        danger: `
          bg-terre text-blanc
          hover:bg-terre-light
        `,
      },
      size: {
        sm:   'h-8  px-4  text-sm   rounded-lg',
        md:   'h-11 px-6  text-sm   rounded-xl',
        lg:   'h-14 px-8  text-base rounded-xl',
        xl:   'h-16 px-10 text-lg   rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  )
)
Button.displayName = 'Button'
```

---

## 4 — MOTION DESIGN SYSTEM

### Framer Motion Variants

```typescript
// packages/ui/src/motion.ts
import { type Variants } from 'framer-motion'

/* Page transitions */
export const pageVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] },
  },
}

/* Staggered container (for lists of items) */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

/* Individual staggered item */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

/* Hero title (cinematic reveal) */
export const heroTitle: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2,
    },
  },
}

/* Pass achievement (ceremony animation) */
export const passAchieve: Variants = {
  initial: { scale: 0.85, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1], /* spring */
    },
  },
}

/* Gold shimmer (for EPS rewards) */
export const goldShimmer = {
  initial:   { backgroundPosition: '-200% center' },
  animate: {
    backgroundPosition: '200% center',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

/* Governance vote cast */
export const voteRipple: Variants = {
  initial: { scale: 0, opacity: 0.8 },
  animate: {
    scale: 4,
    opacity: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}
```

---

## 5 — UX INTERACTION PHILOSOPHY

### The Calm Design Principles

**Principle 1: One Action Per Moment**
Every screen presents one primary action. Never two. The user should never wonder what to do. The UI decides — gently, clearly.

**Principle 2: Reward Before Requirement**
Never ask users to do something before giving them something. Academy course? Show the credential they'll earn at the start. Governance vote? Show the impact first. Pass upgrade? Show what unlocks.

**Principle 3: Error Is Not Failure**
When something goes wrong, the UI treats it as information, not failure. "Transaction pending" is shown calmly, with context, with an estimated wait time. No red banners. No alarming language.

**Principle 4: Data Has Meaning**
Every number displayed has context. Not "742 EPS" — "742 EPS · Builder tier · Next: 1,000". The number alone is not information. The number in context is meaning.

**Principle 5: Silence Is Premium**
What you don't show is as important as what you do. No notification badges without user opt-in. No modals that interrupt unless critical. No auto-playing videos. No popups. The product is calm because the people who built it respect your attention.

### Screen States

```
Every screen in YNKLV has 5 defined states:

EMPTY      — No data yet (beautiful, encouraging, not a blank white screen)
LOADING    — Skeleton states that mirror final layout (no spinners)
PARTIAL    — Some data, more loading (progressive disclosure)
FULL       — All data present (the designed experience)
ERROR      — Something failed (calm, with clear recovery path)

Design rule: All 5 states are designed before development begins.
A feature is not complete until all 5 states are implemented.
```

---

## 6 — INTERACTION HIERARCHY

```
TIER 1 — CRITICAL ACTIONS (maximum visual weight)
  → Join Ecosystem
  → Connect Wallet
  → Publish Product
  → Vote on Proposal
  Styling: Full-width or large CTA, Or Profond background, void text

TIER 2 — PRIMARY ACTIONS (strong visual weight)
  → View Balance
  → Access AI
  → Update Profile
  → Claim Rewards
  Styling: Bordered button, blanc text

TIER 3 — SECONDARY ACTIONS (medium weight)
  → Share
  → View Details
  → Filter
  → Sort
  Styling: Ghost button, text-secondary

TIER 4 — DESTRUCTIVE ACTIONS (always last resort)
  → Leave community
  → Revoke credential
  → Burn tokens
  Styling: Terre Rouge, requires confirmation with burn amount displayed
```

---

*"The design system is not a library of components. It is the visual constitution of the ecosystem. Every pixel is a policy."*
