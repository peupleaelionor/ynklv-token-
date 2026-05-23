# Security Policy

YNKLV is designed to hold value and coordinate a community for decades. Security is
treated as architecture, not an afterthought. This document covers responsible
disclosure, scope, and the operational security model.

## Responsible Disclosure

If you discover a vulnerability, **please do not open a public issue.**

- Email: `security@yankelv.xyz` (PGP key published at `/.well-known/security.txt`).
- Include: a description, reproduction steps, affected component, and impact.
- We acknowledge within **48 hours** and aim to triage within **5 business days**.
- Please allow a reasonable disclosure window before any public discussion.

We do not pursue legal action against good-faith researchers who follow this policy,
avoid privacy violations and service degradation, and do not exfiltrate data.

## Bug Bounty

A bounty program is live before mainnet value is at risk. Severity is assessed using
the Immunefi classification system. Tiers (indicative):

| Severity | Examples | Reward range |
|---|---|---|
| Critical | Loss/freezing of funds, mint bug, unauthorized role escalation | Highest |
| High | Treasury drain via governance, broken split invariant | High |
| Medium | DoS of a non-critical service, gate bypass for non-funds access | Medium |
| Low | Best-practice deviations without direct exploit | Low |

## Scope

In scope:
- `packages/contracts/**` and `contracts/**` (Solidity)
- `services/**` (API, indexer, worker)
- `packages/sdk/**` (access enforcement logic)

Out of scope:
- Third-party regulated payment providers (report to the provider)
- Theoretical issues without a practical exploit path
- Findings requiring privileged keys you were entrusted with

## Smart Contract Security Model

- **No mint.** No ecosystem contract can create supply. The token is fixed at genesis.
- **Least privilege.** Every privileged function is role-gated; roles are documented in
  `packages/contracts/README.md`.
- **Separated emergency powers.** The Askari (4-of-7) can *pause* on a verified exploit
  but cannot *unpause*, move funds, or govern. Unpause is held by the timelock.
- **Immutable economics.** The Soko 90/8.5/1.5 split is enforced as constants; changing
  it requires deploying a new contract.
- **Defense in depth.** `ReentrancyGuard` on funds-moving paths, `SafeERC20` everywhere,
  checks-effects-interactions ordering, Solidity ≥0.8 overflow checks.
- **Audits.** ≥2 independent audits (e.g. Trail of Bits + a competitive contest) before
  mainnet, with reports published. See `docs/32-treasury-security.md`.

## Operational Security

- Admin authority resides in a multisig, then a timelock — never a single EOA.
- Indexer service keys hold only `SCORER_ROLE`/`DISTRIBUTOR_ROLE`, never admin.
- Key management uses hardware signers; signers are geographically distributed.
- Social-engineering defenses and the founder-risk model are documented in
  `docs/30-founder-protection.md`.

## Disclosure of Privileged Roles

A live, human-readable role audit is published in the dashboard admin view and mirrored
in `packages/contracts/README.md`. Any role change emits an on-chain event and triggers
monitoring alerts.
