# YNKLV Ecosystem — Claude Code Reference

## Project overview

YNKLV is an **Afro-global utility token ecosystem** deployed on **Base L2** (Coinbase's Ethereum L2).
The ecosystem powers the Zamani platform — a creator economy, digital marketplace (Soko), governance
layer (Indaba), and knowledge hub (Academy) centered on African and diaspora culture.

### Naming convention (critical)

| Context | Name |
|---|---|
| Brand / product / UI | **YNKLV** |
| On-chain token name | **KLVCOIN** |
| On-chain token symbol | **YNKLV** |
| Popular / casual reference | **K-coin** |
| Foundation / ecosystem entity | **Zamani** / **Zamani Foundation** |

Never use "YNKLV coin" or "KLVCOIN" in UI copy — use "YNKLV" or "K-coin" per context.

### Compliance rules (non-negotiable)

YNKLV is a **utility token**. It is NOT a financial instrument.

- Never use: yield, APY, staking rewards, guaranteed returns, passive income, investment opportunity, profit, get rich, to the moon, risk-free
- Always frame token holdings as **access thresholds**, not investments
- Any EUR fiat on/off-ramp copy must include the required disclaimer from `packages/config/src/index.ts`
- The `scripts/compliance-scan.sh` script runs in CI and blocks merges on prohibited language in `apps/` and `examples/`

---

## Key commands

```bash
# Monorepo (from root)
pnpm dev                    # Start all dev servers in parallel (Turborepo)
pnpm build                  # Build all packages and apps
pnpm lint                   # Lint all packages
pnpm typecheck              # TypeScript check all packages

# Solidity contracts
pnpm contracts:test         # Run Foundry tests (forge test)
cd packages/contracts && forge test -vvv          # Verbose test output
cd packages/contracts && forge test --match-contract YNKLVToken   # Single contract
cd packages/contracts && forge build              # Compile contracts
cd packages/contracts && forge fmt               # Format Solidity

# Individual services (from root)
pnpm --filter @ynklv/api dev            # Hono API server (port 3001)
pnpm --filter @ynklv/dashboard dev      # Next.js dashboard (port 3002)

# Compliance
bash scripts/compliance-scan.sh         # Scan for prohibited language

# Type generation after contract changes
cd packages/contracts && forge build && pnpm --filter @ynklv/sdk run codegen
```

---

## Architecture overview

```
/
├── apps/
│   ├── dashboard/          Next.js 14 admin + user dashboard (port 3002)
│   └── web/                Next.js marketing / landing site
├── packages/
│   ├── contracts/          Solidity (Foundry) — canonical smart contracts
│   │   ├── src/
│   │   │   ├── YNKLVToken.sol              ERC-20 utility token (KLVCOIN/YNKLV)
│   │   │   ├── MembershipRegistry.sol       On-chain tier tracking
│   │   │   ├── EcosystemRewardsVault.sol    Contributor reward allocations
│   │   │   ├── CreatorRewardsDistributor.sol Soko sale split (90/8.5/1.5)
│   │   │   └── interfaces/IYNKLV.sol        Token interface (ERC20+Permit+Votes)
│   │   ├── test/                            Forge unit + fuzz tests
│   │   └── script/Deploy.s.sol             Deployment script
│   ├── config/             Chain config, contract addresses, tier thresholds
│   ├── types/              Shared TypeScript types (MembershipTier, Address, etc.)
│   ├── sdk/                Viem-based client SDK for contract interactions
│   ├── api-client/         Typed HTTP client for the Hono API
│   ├── token-gates/        React hooks / HOCs for tier-gated UI
│   ├── payments/           EUR fiat on/off-ramp integration
│   ├── analytics/          Usage event tracking
│   ├── ui/                 Shared React component library
│   ├── utils/              Shared utility functions
│   └── abi/                Generated contract ABIs
├── services/
│   ├── api/                Hono API (port 3001) — REST endpoints, in-memory store
│   ├── indexer/            Viem-based on-chain event indexer
│   └── worker/             Background jobs (epoch transitions, etc.)
├── scripts/
│   └── compliance-scan.sh  CI guard against prohibited language
├── contracts/              LEGACY root-level contracts (do not use for new work)
│   └── src/YNKLVToken.sol  Old prototype — superseded by packages/contracts
└── docs/                   Design documents and legal/regulatory notes
```

---

## Token design

- **Fixed supply**: 1,000,000,000 YNKLV — minted once at genesis, no further minting
- **Burnable**: ecosystem contracts burn YNKLV as economic activity occurs
- **Governance**: ERC20Votes (EIP-5805) for on-chain Indaba governance
- **Gasless approvals**: ERC20Permit (EIP-2612) for low-fee African UX
- **Emergency pause**: PAUSER_ROLE (held by multisig) can pause transfers
- **No owner/admin over supply**: AccessControl only governs pause, not minting

### Soko sale revenue split (on-chain, immutable)

| Recipient | Share |
|---|---|
| Creator | 90% |
| Treasury (Baraka multisig) | 8.5% |
| Burn | 1.5% |

### Membership tiers (access, not financial)

| Tier | Min YNKLV | Min Contribution Score | Grants |
|---|---|---|---|
| Observer | 0 | 0 | Read access, Soko browsing |
| Builder | 100 | 100 | Soko publish, City Charter voting |
| Creator | 500 | 500 | Nommo faculties, Indaba proposals |
| Architect | 2,500 | 1,000 | Council voting, City Charter creation |
| Guardian | 10,000 | 2,500 | Zamani Ledger authorship, protocol design |

---

## Key files

| File | Purpose |
|---|---|
| `packages/contracts/src/YNKLVToken.sol` | Canonical ERC-20 token — KLVCOIN/YNKLV |
| `packages/contracts/src/interfaces/IYNKLV.sol` | Token interface used by ecosystem contracts |
| `packages/config/src/index.ts` | All shared constants: chains, addresses, tiers, compliance |
| `packages/types/src/index.ts` | TypeScript type definitions |
| `services/api/src/store/seed.ts` | In-memory dev data (replace with Postgres in prod) |
| `services/api/src/index.ts` | Hono API entry point |
| `apps/dashboard/tailwind.config.js` | Tailwind with YNKLV design tokens |
| `apps/dashboard/src/app/globals.css` | CSS custom properties for design tokens |
| `scripts/compliance-scan.sh` | CI compliance language guard |
| `packages/contracts/script/Deploy.s.sol` | Foundry deployment script |

---

## CI/CD pipeline

The project uses GitHub Actions with the following pipeline:

1. **Lint** — ESLint across all TypeScript packages
2. **Typecheck** — `tsc --noEmit` for all packages
3. **Test (TS)** — Vitest unit tests
4. **Test (Solidity)** — `forge test` with 10,000 fuzz runs
5. **Compliance scan** — `scripts/compliance-scan.sh` (blocks on prohibited language)
6. **Build** — Turborepo build of all packages and apps
7. **Slither** (on PRs to main) — Static analysis via `packages/contracts/slither.config.json`

### Branches

- `main` — production-ready; requires all CI checks green + 1 review
- `develop` — integration branch
- `claude/*` — Claude Code working branches

### Environment variables required

```bash
BASE_RPC_URL=                   # Base mainnet RPC
BASE_SEPOLIA_RPC_URL=            # Base Sepolia RPC
BASESCAN_API_KEY=                # For contract verification
DEPLOYER_PRIVATE_KEY=            # Deployer wallet (use hardware wallet in prod)
YNKLV_TOKEN_ADDRESS=             # Deployed token address (post-deploy)
TREASURY_ADDRESS=                # Baraka multisig
ADMIN_ADDRESS=                   # Indaba council multisig / timelock
NEXT_PUBLIC_WALLETCONNECT_ID=    # WalletConnect project ID
SUPABASE_URL=                    # Postgres (production only)
SUPABASE_SERVICE_KEY=            # Postgres service key
```

---

## Working with contracts

```bash
# Run all tests with verbose output
cd packages/contracts && forge test -vvv

# Run only the token tests
cd packages/contracts && forge test --match-contract YNKLVToken -vvv

# Run fuzz tests with more runs (override foundry.toml default)
cd packages/contracts && forge test --fuzz-runs 50000

# Deploy to Base Sepolia (dry run)
cd packages/contracts && forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --dry-run

# Format Solidity code
cd packages/contracts && forge fmt

# Run Slither (requires slither installed)
cd packages/contracts && slither . --config-file slither.config.json
```

### OZ v5 import paths

All contracts use OpenZeppelin v5 with the remapping `@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/`.

```solidity
// Correct v5 imports
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
// Note: OZ v5 removed Ownable2Step from utils — use access/Ownable2Step.sol
```

---

## Package name registry

All internal packages use the `@ynklv/` scope. Do not rename them.

`@ynklv/contracts`, `@ynklv/config`, `@ynklv/types`, `@ynklv/sdk`, `@ynklv/api-client`,
`@ynklv/token-gates`, `@ynklv/payments`, `@ynklv/analytics`, `@ynklv/ui`, `@ynklv/utils`,
`@ynklv/abi`, `@ynklv/dashboard`, `@ynklv/web`
