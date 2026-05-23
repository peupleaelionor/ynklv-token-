# Contributing to YANKELV

YANKELV is built to last. Contributions are welcome from anyone who shares the standard:
utility before speculation, elegance before hype, transparency as architecture.

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`corepack enable`)
- Foundry (for contract work): https://book.getfoundry.sh/getting-started/installation

## Setup

```bash
git clone https://github.com/peupleaelionor/ynklv-token-.git
cd ynklv-token-
pnpm install
cp .env.example .env        # fill in what you need
pnpm setup                  # one-time bootstrap (installs Foundry deps, etc.)
```

## Everyday commands

```bash
pnpm dev                    # run apps in dev
pnpm build                  # build everything (turbo)
pnpm test                   # run all tests
pnpm lint                   # lint
pnpm typecheck              # typecheck all packages

pnpm contracts:test         # Foundry tests
pnpm contracts:deploy:base-sepolia
pnpm contracts:verify
```

## Repository layout

```
apps/        web (landing), dashboard, docs
packages/    contracts, sdk, ui, config, utils, types, api-client,
             token-gates, payments, analytics
services/    indexer, api, worker
examples/    integration templates
```

## Standards

- **TypeScript strict.** No `any` without justification. Public APIs are fully typed.
- **No investment language.** Code, comments, copy, and docs describe utility, access,
  and participation — never yield, APY, profit, or returns. See `packages/config`
  `COMPLIANCE.prohibitedLanguage` and `docs/31-legal-regulatory-resilience.md`.
- **Tests where it matters.** Funds-moving contracts and access logic require tests
  (unit + fuzz for contracts).
- **Small, focused PRs.** One concern per PR. Describe the "why".
- **Security first.** Never weaken a guard to make a test pass. See `SECURITY.md`.

## Commit & PR

- Conventional-style messages (`feat:`, `fix:`, `docs:`, `chore:`).
- CI must be green (lint, typecheck, test, contract tests, build, security scan).
- Link the issue and describe the testing performed.

## Code of conduct

Be excellent to one another. Ubuntu — *"I am because we are."*
