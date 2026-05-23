# YNKLV Monorepo Structure

## Complete Project Architecture

---

## Directory Tree

```
ynklv/
│
├── README.md                          ← Ecosystem overview
├── package.json                       ← Root (pnpm workspaces)
├── pnpm-workspace.yaml
├── turbo.json                         ← Turborepo pipeline
├── .env.example
│
├── apps/
│   ├── web/                           ← Main marketing + app site
│   │   ├── src/
│   │   │   ├── app/                   ← Next.js App Router
│   │   │   │   ├── layout.tsx         ← Root layout, providers, metadata
│   │   │   │   ├── page.tsx           ← Homepage (cinematic landing)
│   │   │   │   ├── providers.tsx      ← Wagmi + RainbowKit + React Query
│   │   │   │   ├── (marketing)/       ← Public pages (route group, no auth)
│   │   │   │   │   ├── about/page.tsx
│   │   │   │   │   ├── token/page.tsx
│   │   │   │   │   ├── creators/page.tsx
│   │   │   │   │   ├── governance/page.tsx
│   │   │   │   │   └── roadmap/page.tsx
│   │   │   │   └── (app)/             ← Authenticated app (route group)
│   │   │   │       ├── layout.tsx     ← App shell, wallet required
│   │   │   │       ├── dashboard/page.tsx
│   │   │   │       ├── studio/
│   │   │   │       │   ├── page.tsx   ← Studio browse
│   │   │   │       │   ├── publish/page.tsx
│   │   │   │       │   └── [productId]/page.tsx
│   │   │   │       ├── pass/page.tsx
│   │   │   │       ├── ai/page.tsx
│   │   │   │       ├── identity/page.tsx
│   │   │   │       └── governance/
│   │   │   │           ├── page.tsx
│   │   │   │           └── [proposalId]/page.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── nav/               ← Navigation
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   └── MobileNav.tsx
│   │   │   │   ├── wallet/
│   │   │   │   │   ├── ConnectButton.tsx   ← Custom styled RainbowKit
│   │   │   │   │   └── WalletGuard.tsx     ← Auth gate component
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── TokenBalanceCard.tsx
│   │   │   │   │   ├── EPSMeter.tsx
│   │   │   │   │   └── RecentActivity.tsx
│   │   │   │   ├── pass/
│   │   │   │   │   ├── PassRenderer.tsx    ← On-chain SVG rendered in browser
│   │   │   │   │   └── PassMinter.tsx
│   │   │   │   ├── studio/
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   ├── PublishForm.tsx
│   │   │   │   │   └── RevenueDisplay.tsx
│   │   │   │   ├── governance/
│   │   │   │   │   ├── ProposalCard.tsx
│   │   │   │   │   └── VotePanel.tsx
│   │   │   │   └── ui/                ← Primitives (from packages/ui)
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useYNKLV.ts        ← Token balance, EPS, Pass state
│   │   │   │   ├── useStudio.ts       ← Studio reads/writes
│   │   │   │   ├── useGovernance.ts   ← Governance reads/writes
│   │   │   │   ├── useEPS.ts          ← EPS score (Supabase + on-chain)
│   │   │   │   └── useProfile.ts      ← Supabase user profile
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── wagmi.ts           ← Wagmi config (Base + Mainnet)
│   │   │   │   ├── contracts.ts       ← ABIs + addresses per chain
│   │   │   │   ├── supabase.ts        ← Supabase client (browser)
│   │   │   │   ├── supabase.server.ts ← Supabase client (server-side)
│   │   │   │   ├── ipfs.ts            ← IPFS upload/resolve helpers
│   │   │   │   └── formatting.ts     ← Number/date/address formatters
│   │   │   │
│   │   │   └── styles/
│   │   │       └── globals.css        ← YNKLV design tokens + base styles
│   │   │
│   │   ├── public/
│   │   │   ├── logo.png
│   │   │   ├── og.png                 ← Open Graph image (1200×630)
│   │   │   ├── noise.svg              ← Noise texture (for overlays)
│   │   │   ├── favicon.ico
│   │   │   └── manifest.json          ← PWA manifest
│   │   │
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts         ← Full YNKLV design system
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── treasury-dashboard/            ← Public treasury dashboard
│       ├── src/
│       │   ├── app/
│       │   │   └── page.tsx           ← Real-time treasury viewer
│       │   └── components/
│       │       ├── TreasuryBalance.tsx
│       │       ├── TransactionLog.tsx
│       │       ├── SignerPanel.tsx
│       │       └── RunwayCalc.tsx
│       └── package.json
│
├── packages/
│   ├── ui/                            ← Shared component library
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── TokenBalanceCard.tsx
│   │   │   ├── PassRenderer.tsx
│   │   │   ├── HexGlyph.tsx           ← Reusable hexagonal SVG
│   │   │   ├── EPSMeter.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── motion.ts              ← Shared Framer Motion variants
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                        ← Shared config (eslint, ts, tailwind base)
│   │   ├── eslint-preset.js
│   │   ├── tsconfig.base.json
│   │   └── tailwind-base.ts
│   │
│   └── abi/                           ← Auto-generated ABI exports
│       ├── src/
│       │   ├── YNKLVToken.ts
│       │   ├── YNKLVPass.ts
│       │   ├── YNKLVStudio.ts
│       │   ├── YNKLVGovernor.ts
│       │   └── index.ts
│       └── package.json
│
├── contracts/                         ← Foundry project
│   ├── src/
│   │   ├── YNKLVToken.sol
│   │   ├── YNKLVVesting.sol
│   │   ├── YNKLVPass.sol
│   │   ├── YNKLVStudio.sol
│   │   ├── YNKLVGovernor.sol
│   │   └── YNKLVTimelock.sol
│   ├── test/
│   │   ├── YNKLVToken.t.sol
│   │   ├── YNKLVVesting.t.sol
│   │   ├── YNKLVPass.t.sol
│   │   ├── YNKLVStudio.t.sol
│   │   └── YNKLVGovernor.t.sol
│   ├── script/
│   │   ├── Deploy.s.sol
│   │   └── Verify.s.sol
│   ├── lib/                           ← Forge submodules
│   │   └── openzeppelin-contracts/
│   ├── foundry.toml
│   └── remappings.txt
│
├── docs/                              ← Strategic documents
│   ├── 00-manifesto.md
│   ├── 01-identity.md
│   ├── 04-utilities.md
│   ├── 07-security-trust.md
│   ├── 10-roadmap.md
│   ├── 11-economic-realism.md
│   ├── 12-trust-architecture.md
│   ├── 15-product-ecosystem.md
│   ├── 16-psychology-behavior.md
│   ├── ECOSYSTEM-ARCHITECTURE.md
│   └── ULTIMATE-DIRECTIVE.md
│
├── brand/                             ← Brand documents + assets
│   ├── 05-visual-system.md
│   ├── 14-cultural-dominance.md
│   └── DESIGN-SYSTEM.md
│
├── strategy/                          ← Strategy documents
│   ├── 03-africa-first-strategy.md
│   ├── 08-viral-growth.md
│   ├── 13-africa-real-world.md
│   └── 17-global-execution.md
│
├── tech/                              ← Technical specifications
│   ├── 06-tech-stack.md
│   └── MONOREPO-STRUCTURE.md         ← This file
│
├── tokenomics/
│   └── 02-token-design.md
│
└── website/
    └── 09-website-design.md
```

---

## Turborepo Pipeline

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": ["^build"]
    },
    "contracts:test": {
      "cache": false
    },
    "contracts:deploy": {
      "cache": false
    }
  }
}
```

---

## Key Architectural Decisions

### Why App Router (Next.js 14)?
- Route groups `(marketing)` vs `(app)` cleanly separate public and authenticated contexts
- Server Components fetch Supabase data server-side → no client-side loading flicker
- Edge Runtime for global low-latency (critical for Africa CDN distribution)
- Built-in image optimization handles WebP conversion for bandwidth efficiency

### Why Turborepo?
- Parallel builds across packages and apps
- Shared caches mean `packages/ui` is only rebuilt when its source changes
- Consistent linting and type-checking across the entire monorepo
- ABIs are generated once from contracts and consumed everywhere

### Why pnpm?
- Strict dependency resolution (no phantom dependencies)
- Disk-efficient with hard-links (fast on CI)
- Native workspaces support

### Why packages/abi as a separate package?
- ABI types are auto-generated from Solidity via `forge build` + `wagmi generate`
- Any app that imports a contract ABI gets the same type-safe version
- Changes to contracts → re-run generation → TypeScript errors surface across all apps
- This prevents ABI drift bugs (one of the most common Web3 frontend bugs)

### Why treasury-dashboard as a separate app?
- Completely independent deployment — if the main app goes down, the treasury dashboard stays up
- No authentication required — public, read-only
- Different performance profile (real-time updates > marketing page)
- Separate Vercel project with its own domain (`treasury.ynklv.xyz`)

---

## Environment Variables

```bash
# .env.example

# ─── Blockchain ─────────────────────────────────────
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=
NEXT_PUBLIC_MAINNET_RPC_URL=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# ─── Contract Addresses (populated post-deployment) ─
NEXT_PUBLIC_YNKLV_TOKEN_BASE=
NEXT_PUBLIC_YNKLV_PASS_BASE=
NEXT_PUBLIC_YNKLV_STUDIO_BASE=
NEXT_PUBLIC_YNKLV_TREASURY_BASE=
NEXT_PUBLIC_YNKLV_TOKEN_SEPOLIA=
NEXT_PUBLIC_YNKLV_PASS_SEPOLIA=
NEXT_PUBLIC_YNKLV_STUDIO_SEPOLIA=
NEXT_PUBLIC_YNKLV_TREASURY_SEPOLIA=

# ─── Supabase ────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # Server-side only — never NEXT_PUBLIC_

# ─── IPFS ────────────────────────────────────────────
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
IPFS_API_KEY=                  # Pinata or web3.storage

# ─── AI (server-side only) ───────────────────────────
ANTHROPIC_API_KEY=             # For YNKLV AI features
OPENAI_API_KEY=                # For image generation (Oro Visuals)

# ─── Analytics ───────────────────────────────────────
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=ynklv.xyz

# ─── Deployment ──────────────────────────────────────
VERCEL_ENV=                    # development | preview | production
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/ci.yml

on: [push, pull_request]

jobs:
  contracts:
    name: Smart Contracts
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { submodules: recursive }
      - uses: foundry-rs/foundry-toolchain@v1
      - run: forge build
      - run: forge test --fuzz-runs 10000

  frontend:
    name: Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm build
```

---

*"A well-structured repository is itself a trust signal. Visitors who look at the code should see care, not chaos."*
