# @ynklv/contracts

YNKLV ecosystem utility contracts. Built on **OpenZeppelin Contracts v5** and tested
with **Foundry**. These complement the core fixed-supply `YNKLVToken` (see `/contracts`)
with the access, rewards, and creator-settlement layers.

> Every privileged action is role-gated, every emergency power is narrow, and no
> contract here can mint or inflate supply.

## Contracts

| Contract | Purpose | Holds funds? |
|---|---|---|
| `MembershipRegistry` | Resolves a member's tier from YNKLV balance + contribution score (Sankofa). Pure access layer. | No |
| `EcosystemRewardsVault` | Distributes **pre-funded** YNKLV to recognize contribution. Per-epoch budget cap. Not yield. | Yes (pre-funded only) |
| `CreatorRewardsDistributor` | Settles Soko purchases with an **immutable** 90 / 8.5 / 1.5 split. | Transient only |
| `interfaces/IYNKLV` | Minimal interface to the burnable, fixed-supply token. | — |

## Privileged Roles — full disclosure

| Role | Held by (production) | Powers | Cannot |
|---|---|---|---|
| `DEFAULT_ADMIN_ROLE` | The timelock (the Indaba) | Grant/revoke roles, unpause, sweep **unreserved** funds | Mint, move reserved rewards, change the Soko split |
| `GOVERNOR_ROLE` | The timelock (the Indaba) | Tune thresholds within bounds, set epoch budget, set treasury sink | Exceed hard bounds, touch user funds |
| `SCORER_ROLE` | The indexer (Sankofa oracle) | Award contribution score | Slash, move funds, change tiers |
| `DISTRIBUTOR_ROLE` | The indexer / Indaba executor | Allocate rewards within budget, roll epochs | Exceed budget, reserve more than the vault holds |
| `PAUSER_ROLE` | The Askari (4-of-7 multisig) | Pause in a verified emergency | Unpause, move funds, govern |

**Design intent:** the *pause* power (Askari) and the *unpause* power (admin/timelock)
are deliberately split so a single emergency key can never both freeze and resume the
system. Slashing reputation is governor-gated, not scorer-gated, because reducing a
member's standing is heavier than awarding it.

## Invariants (asserted in tests, candidates for formal verification)

- `EcosystemRewardsVault.totalOutstanding <= token.balanceOf(vault)` — the vault can
  always pay what it owes.
- `CreatorRewardsDistributor`: `toCreator + toTreasury + burned == amount` for every
  purchase, with `toCreator >= toTreasury + burned` (creator always receives ≥90%).
- `CREATOR_SHARE_BPS + TREASURY_SHARE_BPS + BURN_SHARE_BPS == 10_000`.

## Setup

```bash
# Install Foundry deps (run once, requires network)
forge install OpenZeppelin/openzeppelin-contracts foundry-rs/forge-std --no-commit

pnpm --filter @ynklv/contracts test
pnpm --filter @ynklv/contracts test:gas
pnpm --filter @ynklv/contracts coverage
```

## Deployment

```bash
# Required env: DEPLOYER_PRIVATE_KEY, YNKLV_TOKEN_ADDRESS, TREASURY_ADDRESS, ADMIN_ADDRESS
pnpm contracts:deploy:base-sepolia
pnpm contracts:deploy:base
```

`ADMIN_ADDRESS` MUST be a multisig in production. Immediately after deployment, assign
`SCORER_ROLE`/`DISTRIBUTOR_ROLE` to the indexer and narrow `DEFAULT_ADMIN_ROLE` to the
timelock. See `SECURITY-CHECKLIST.md`.
