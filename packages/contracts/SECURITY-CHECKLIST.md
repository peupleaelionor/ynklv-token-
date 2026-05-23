# YNKLV Contracts — Security Checklist

A pre-deployment and ongoing-operations checklist. This is engineering discipline,
not a substitute for independent audit.

## Pre-deployment

- [ ] All contracts compile with `solc 0.8.24`, optimizer on, no warnings.
- [ ] `forge test -vvv` green; fuzz runs ≥ 10,000; invariant runs ≥ 256.
- [ ] `forge coverage` reviewed; critical paths at 100%.
- [ ] Slither run clean (or every finding triaged and documented).
- [ ] No `selfdestruct`, no `delegatecall` to untrusted targets, no `tx.origin` auth.
- [ ] All external calls use `SafeERC20`; state changes precede transfers (CEI).
- [ ] `ReentrancyGuard` on every funds-moving external function (`claim`, `purchase`).
- [ ] Integer math reviewed; Solidity ≥0.8 overflow checks relied upon intentionally.
- [ ] Every privileged function has an explicit role modifier.
- [ ] Role assignments documented and minimal (least privilege).

## Access control

- [ ] `DEFAULT_ADMIN_ROLE` assigned to a multisig, then to the timelock.
- [ ] `PAUSER_ROLE` (Askari) and unpause authority are held by **different** parties.
- [ ] `SCORER_ROLE` / `DISTRIBUTOR_ROLE` assigned only to the indexer service key.
- [ ] Deployer EOA renounces all roles after handoff.
- [ ] No single EOA can move user funds or change the Soko split.

## Economic / invariant

- [ ] Soko split constants sum to exactly 10,000 bps (asserted in constructor).
- [ ] Rewards vault cannot reserve more than its balance (tested).
- [ ] Per-epoch reward budget is set and bounded.
- [ ] No mint path exists in any ecosystem contract.
- [ ] No yield/APY/auto-compounding logic anywhere.

## Emergency

- [ ] Askari pause council is 4-of-7, keys geographically distributed.
- [ ] Pause scope verified: pausing halts new actions, never traps owed funds beyond
      the pause window; unreserved sweep is admin-only.
- [ ] Emergency runbook published (see `/docs/30-founder-protection.md`).
- [ ] Askari sunset milestone defined.

## Audit & disclosure

- [ ] ≥2 independent audits scheduled (e.g. Trail of Bits + competitive contest).
- [ ] Bug bounty live before mainnet value is at risk.
- [ ] `SECURITY.md` responsible-disclosure policy published at repo root.
- [ ] Deployed addresses + verified source published on Basescan.

## Post-deployment

- [ ] Contract source verified on the block explorer.
- [ ] Role assignments confirmed on-chain match this checklist.
- [ ] Monitoring/alerting live for pause events, large transfers, role changes.
