# YNKLV — The Afro-Global Digital Asset Ecosystem

> *"Not a coin. A civilization."*

---

## What is YNKLV?

YNKLV is a premium utility token and cultural ecosystem built at the intersection of African creativity, global digital infrastructure, and AI-native commerce. It is not a speculation vehicle. It is not a meme. It is a long-term digital institution — designed to last decades.

YNKLV exists to give creators, builders, and communities across Africa and the African diaspora genuine ownership of the digital economy they are already building.

---

## Repository Map

### Foundation

| Document | Description |
|---|---|
| [docs/00-manifesto.md](docs/00-manifesto.md) | The YNKLV Manifesto |
| [docs/ULTIMATE-DIRECTIVE.md](docs/ULTIMATE-DIRECTIVE.md) | Civilization-scale architecture + 5 original mechanisms |
| [docs/ECOSYSTEM-ARCHITECTURE.md](docs/ECOSYSTEM-ARCHITECTURE.md) | System diagrams, value flows, retention model |

### Strategy & Identity (Parts 1–17)

| Part | File | Description |
|---|---|---|
| 1  | [docs/01-identity.md](docs/01-identity.md) | Mission, Vision, Philosophy, Afrofuturist positioning |
| 2  | [tokenomics/02-token-design.md](tokenomics/02-token-design.md) | ERC-20, 1B fixed supply, tokenomics |
| 3  | [strategy/03-africa-first-strategy.md](strategy/03-africa-first-strategy.md) | Africa-first global strategy |
| 4  | [docs/04-utilities.md](docs/04-utilities.md) | AI, Studio, Pass, Identity, Governance |
| 5  | [brand/05-visual-system.md](brand/05-visual-system.md) | Visual identity, color, typography |
| 6  | [tech/06-tech-stack.md](tech/06-tech-stack.md) | Base, Next.js, Supabase, Wagmi |
| 7  | [docs/07-security-trust.md](docs/07-security-trust.md) | Anti-rug, multisig, audits |
| 8  | [strategy/08-viral-growth.md](strategy/08-viral-growth.md) | Launch, creator partnerships, growth |
| 9  | [website/09-website-design.md](website/09-website-design.md) | Landing page architecture |
| 10 | [docs/10-roadmap.md](docs/10-roadmap.md) | 30-day, 90-day, 1-year roadmap |
| 11 | [docs/11-economic-realism.md](docs/11-economic-realism.md) | 20-year economic design |
| 12 | [docs/12-trust-architecture.md](docs/12-trust-architecture.md) | Progressive decentralization, institutional trust |
| 13 | [strategy/13-africa-real-world.md](strategy/13-africa-real-world.md) | DRC, Francophone, Anglophone, Diaspora |
| 14 | [brand/14-cultural-dominance.md](brand/14-cultural-dominance.md) | Rituals, symbols, movement design |
| 15 | [docs/15-product-ecosystem.md](docs/15-product-ecosystem.md) | Full product suite |
| 16 | [docs/16-psychology-behavior.md](docs/16-psychology-behavior.md) | Human psychology, ethical retention |
| 17 | [strategy/17-global-execution.md](strategy/17-global-execution.md) | Foundation, team, content, partnerships |

### Technical Specifications

| File | Description |
|---|---|
| [brand/DESIGN-SYSTEM.md](brand/DESIGN-SYSTEM.md) | Design tokens, Tailwind config, component library, motion system |
| [tech/MONOREPO-STRUCTURE.md](tech/MONOREPO-STRUCTURE.md) | Full directory tree, Turborepo pipeline, CI/CD |
| [tech/API-SPECIFICATION.md](tech/API-SPECIFICATION.md) | Complete REST API specification |
| [contracts/smart-contract-specs.md](contracts/smart-contract-specs.md) | Contract architecture + deployment checklist |

### Smart Contracts (Solidity)

| File | Description |
|---|---|
| [contracts/src/YNKLVToken.sol](contracts/src/YNKLVToken.sol) | ERC-20 + Burnable + Permit + Votes. Fixed 1B supply. No admin. |
| [contracts/src/YNKLVVesting.sol](contracts/src/YNKLVVesting.sol) | Linear vesting with cliff, revocable for advisors only |
| [contracts/src/YNKLVPass.sol](contracts/src/YNKLVPass.sol) | Dynamic ERC-721 Pass NFT, soulbound option, on-chain SVG |
| [contracts/src/YNKLVStudio.sol](contracts/src/YNKLVStudio.sol) | Creator monetization — 90/8.5/1.5 revenue split |
| [contracts/test/YNKLVToken.t.sol](contracts/test/YNKLVToken.t.sol) | Foundry tests (unit + fuzz) |
| [contracts/script/Deploy.s.sol](contracts/script/Deploy.s.sol) | Deployment script |
| [contracts/foundry.toml](contracts/foundry.toml) | Foundry configuration |

### Phase 3 — Civilization-Grade Hardening

| Document | Description |
|---|---|
| [docs/30-founder-protection.md](docs/30-founder-protection.md) | Depersonalization, Zamani Foundation, progressive decentralization |
| [docs/31-legal-regulatory-resilience.md](docs/31-legal-regulatory-resilience.md) | MiCA alignment, utility positioning, responsible language guide |
| [docs/32-treasury-security.md](docs/32-treasury-security.md) | Baraka tiered architecture, multisig, attack surface enumeration |
| [docs/33-economic-resilience.md](docs/33-economic-resilience.md) | Sustainable value model, explicit rejection of Ponzi/APY mechanics |
| [docs/34-digital-civilization-layer.md](docs/34-digital-civilization-layer.md) | Identity, reputation, citizenship, sovereignty mechanisms |
| [docs/35-ai-native-infrastructure.md](docs/35-ai-native-infrastructure.md) | Nommo design — "Nommo proposes, humans decide" |
| [docs/36-product-perfection.md](docs/36-product-perfection.md) | Product philosophy, per-surface standards, performance budgets |
| [brand/CULTURAL-LEGACY.md](brand/CULTURAL-LEGACY.md) | Symbolic system, rituals, phrase canon |
| [strategy/GLOBAL-EXPANSION.md](strategy/GLOBAL-EXPANSION.md) | Africa-first city sequencing, phased rollout |

### Phase 4 — Naming Architecture

| Document | Description |
|---|---|
| [brand/NAMING-ARCHITECTURE.md](brand/NAMING-ARCHITECTURE.md) | Complete naming system — Zamani, Mboka, Indaba, Baraka, Nommo, Soko, Sankofa, Askari |

### Phase 5 — Production Monorepo

#### Apps

| App | Description |
|---|---|
| `apps/web` | Cinematic landing page (Next.js 14, Framer Motion, luxury UX) |
| `apps/dashboard` | Member + admin dashboard (user overview, rewards, access grid, treasury, role audit) |

#### Packages

| Package | Description |
|---|---|
| `packages/contracts` | Solidity 0.8.24 — Token, MembershipRegistry, EcosystemRewardsVault, CreatorRewardsDistributor |
| `packages/sdk` | `@ynklv/sdk` — YnklvClient, React hooks, server enforcement |
| `packages/types` | Shared TypeScript types (MembershipTier, ApiResult, CheckoutIntent, …) |
| `packages/config` | Chain config, tier ladder, TOKEN_CONSTANTS, COMPLIANCE |
| `packages/token-gates` | Pure gate evaluation — `evaluateGate`, `Gates.*` helpers |
| `packages/payments` | Payment provider adapters (fiat on-ramp/off-ramp, stablecoin) |
| `packages/analytics` | Privacy-respecting ecosystem analytics (DNT-aware, no PII) |
| `packages/api-client` | Typed fetch client for all 12 API endpoints |
| `packages/ui` | Shared UI primitives |
| `packages/utils` | Shared utilities |
| `packages/abi` | Contract ABI exports |

#### Services

| Service | Description |
|---|---|
| `services/api` | Hono REST API — 12 endpoints, rate limiting, zod validation, MemoryStore seed |
| `services/indexer` | viem event watcher — Transfer, Allocated/Claimed, ContributionUpdated, Purchase |
| `services/worker` | Background job scheduler — epoch settlement, treasury snapshot, contribution rollup |

#### Examples

| Example | Description |
|---|---|
| `examples/nextjs-integration` | Minimal Next.js gate + wallet connect |
| `examples/creator-platform` | Purchase flow with 90/8.5/1.5 split |
| `examples/marketplace` | Server-side access gate with `requireAccess` |
| `examples/ai-saas` | Nommo AI feature gate (Architect tier) |
| `examples/membership-app` | Progressive tier-gate UI component |

#### CI/CD

| File | Description |
|---|---|
| `.github/workflows/ci.yml` | 5 jobs: node, contracts, slither, audit, compliance |
| `scripts/compliance-scan.sh` | Negation-aware prohibited-language guard |
| `scripts/setup.mjs` | One-time bootstrap — toolchain check, .env, forge install |
| `packages/contracts/slither.config.json` | Slither static analysis config |

### Frontend Scaffold (Next.js 14)

| File | Description |
|---|---|
| [apps/web/src/app/page.tsx](apps/web/src/app/page.tsx) | Full homepage implementation (all 10 sections) |
| [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx) | Root layout, SEO metadata, PWA config |
| [apps/web/src/app/providers.tsx](apps/web/src/app/providers.tsx) | Wagmi + RainbowKit + React Query providers |
| [apps/web/src/lib/wagmi.ts](apps/web/src/lib/wagmi.ts) | Wagmi config (Base + Sepolia + Mainnet) |
| [apps/web/src/lib/contracts.ts](apps/web/src/lib/contracts.ts) | ABIs + addresses per chain |
| [apps/web/src/hooks/useYNKLV.ts](apps/web/src/hooks/useYNKLV.ts) | Token balance, Pass state, EPS hooks |
| [apps/web/src/styles/globals.css](apps/web/src/styles/globals.css) | Complete YNKLV design token system |

---

## Quickstart

```bash
git clone https://github.com/peupleaelionor/ynklv-token-.git
cd ynklv-token-
pnpm install
cp .env.example .env
pnpm setup          # toolchain check + forge install
pnpm dev            # all apps in dev mode
```

**Ports:** `web` → 3000 · `dashboard` → 3002 · `api` → 3001

---

## The Five Original Mechanisms

Mechanisms invented for YNKLV — not found in any existing ecosystem:

| Mechanism | Description |
|---|---|
| **The Living Ledger** | Community-curated, on-chain chronicle of ecosystem history |
| **The Contribution Lattice** | Graph-based reputation rooted in Ubuntu philosophy — your connections matter |
| **The Cultural Epoch System** | Named 6-month historical phases with permanent founding cohort credentials |
| **The Contribution Covenant** | Bilateral, on-chain creator rights enforced by smart contract (90% floor) |
| **The City Charter** | Geographic community protocol — local governance, local treasury, local identity |

---

## Token

| Parameter | Value |
|---|---|
| Name | YNKLV |
| Standard | ERC-20 on Base (bridgeable to Ethereum mainnet) |
| Total Supply | 1,000,000,000 — fixed forever |
| Mintable | No — supply fixed at genesis |
| Upgradeable core | No — immutable token contract |
| Largest allocation | 30% Community (never team) |
| Team vesting | 18-month cliff + 30-month linear (48 months total) |
| Liquidity lock | 24 months minimum |
| Audits | 2 independent pre-launch, reports published |
| Burn mechanic | Usage-triggered: AI credits, transfers, Pass minting, governance |

---

## Design References

| Reference | Applied dimension |
|---|---|
| **Bitcoin** | Scarcity, symbolic permanence, ideological conviction |
| **Apple** | Design as values signal, product obsession |
| **Ethereum** | Developer ecosystem, programmable value |
| **Nike** | Community aspiration, identity-first growth |
| **Off-White** | Luxury recontextualized through culture |
| **Stripe** | Developer trust, reliable infrastructure |
| **Afrobeats** | Born local, became universal |
| **Ubuntu** | "I am because we are" — governance and reputation philosophy |

---

## Core Principles

```
Utility before speculation.
Elegance before hype.
Africa as origin, not market.
Culture as infrastructure.
Patience as a feature.
Transparency as architecture.
Trust is built in drops and lost in buckets.
```

---

## The One-Line Brief

**YNKLV is the financial and cultural infrastructure that Afro-global talent has been building toward — finally made ownable.**

---

## License

Smart contract code: MIT License.
Strategic documents: © 2026 YNKLV Foundation. All rights reserved.
