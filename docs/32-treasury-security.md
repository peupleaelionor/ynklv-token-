# YNKLV — Treasury Architecture & Security Systems

*"Tobongisa Mboka — let us build the homeland. A homeland is not defended by a wall. It is defended by who holds the keys, how few hands can act alone, and how visible every act remains."*

Phase 3, Part 3 of the YNKLV institutional record. This document specifies the architecture of **Baraka** (the treasury) and the security systems that protect **Mboka** (the protocol). It is written to the standard expected by an institutional treasury manager, a smart-contract auditor, and a protocol risk reviewer reading it side by side.

The governing principle is the YNKLV principle: **Utility before speculation. Elegance before hype. Transparency as architecture.** Security here is not a feature bolted onto the system. It is the load-bearing structure.

---

## 32.1 — Design Principles

Five principles constrain every decision in this document. Where a convenience and a principle conflict, the principle wins.

1. **No single human is a point of failure.** Not a founder, not a signer, not the Zamani Foundation. Every consequential action requires independent corroboration.
2. **Immutability where it matters; minimal surface where it does not.** The core token and value-split logic are fixed forever. Only peripheral, clearly-bounded modules carry any upgrade path, and that path is itself governed.
3. **Every disbursement traces to a public mandate.** No fund leaves Baraka without an on-chain link to an Indaba proposal. There are no discretionary spends.
4. **The dangerous power is the power to pause, not the power to seize.** The emergency body — **The Askari** — can stop the protocol on verified exploit. It can never move, mint, or redirect value.
5. **Transparency is structural, not promised.** The system is built so that opacity is not an available option, rather than relying on a commitment to be honest.

---

## 32.2 — Baraka: The Treasury as a Commons

Baraka is not a corporate war chest. It is a **commons** held in trust for the YNKLV civilization and governed by **The Indaba** (in the early phase, **The Council**; at maturity, the full EPS-weighted assembly of Pass holders).

Baraka is not a single address. It is a tiered structure of segregated vaults, each with a distinct purpose, risk profile, and authorization threshold.

```
                          BARAKA — TREASURY COMMONS
                          (governed by The Indaba)
                                    │
        ┌───────────────────┬───────┴────────────┬───────────────────┐
        │                   │                    │                   │
   OPERATING VAULT     STRATEGIC RESERVE    ENDOWMENT VAULT     CITY CHARTER VAULTS
   (hot, working)      (cold, runway)       (cold, permanent)   (delegated, local)
        │                   │                    │                   │
   small ops,          large disbursements   principal preserved  geographic local
   recurring costs     12–36 mo runway       spend yield only     treasuries
   1.5% guardian       Indaba vote +         super-majority       Charter council +
   threshold           timelock              + long timelock      Indaba ratification
```

Each vault is a separate multisig with its own signer set and threshold. Funds flow **downward** from reserve to operating under governance authorization; they do not flow laterally or upward without an explicit, voted, time-locked proposal. Compromise of the hot Operating Vault therefore exposes only a small, bounded working balance — never the reserve or endowment.

### Vault Purposes

| Vault | Custody | Purpose | Typical Balance | Authorization |
|---|---|---|---|---|
| Operating | Hot multisig | Recurring ops, grants pipeline, payments | ≤ 90-day burn | Guardian signers, tiered |
| Strategic Reserve | Cold multisig | Runway, large disbursements, rebalancing | 12–36 mo runway | Indaba vote + timelock |
| Endowment | Cold multisig | Perpetual principal; spends yield only | Grows over time | Super-majority + long timelock |
| City Charter | Delegated multisig | Local treasuries and local governance | Per-charter cap | Charter council + Indaba ratification |

---

## 32.3 — Signer Separation & Role Compartmentalization

A treasury is only as safe as the separation between *who can propose*, *who can approve*, and *who can execute*. YNKLV enforces these as distinct roles held by distinct people. Collapsing them into one role is the most common cause of treasury loss in this industry, and it is prohibited.

```
   PROPOSE              APPROVE                EXECUTE              OBSERVE
   ───────              ───────                ───────              ───────
   Indaba member,       Guardian signers       Timelock contract    Zamani Ledger,
   Council, or any      review and sign;       broadcasts after     public dashboard,
   Pass holder via      no signer may          delay elapses;       any observer.
   on-chain proposal.   approve their own      no human can          Read-only.
                        proposal.              accelerate it.

   ── Separation of duty: no individual occupies two adjacent roles ──
```

### Role Definitions

- **Proposers** originate spending requests. A proposer cannot approve their own proposal. Proposals carry a destination, an amount, a rationale, supporting documentation, and a binding link to the originating Indaba mandate.
- **Approvers (Guardian Signers)** are the multisig signers. They review and sign. Their job is verification, not initiation. A signer who originated a proposal is recused from signing it.
- **Executor** is a smart contract — the **timelock** — not a person. Once threshold approval is reached, the timelock alone broadcasts the transaction after the mandated delay. No human holds an "execute now" button on the protected vaults.
- **Observers** are everyone. The **Zamani Ledger** and the public Baraka dashboard render every action visible in near real time.

### Signer Requirements

Guardian signers are not anonymous. Each is:

1. **Publicly identified** — name and professional background on the record.
2. **Independent** — no more than one signer per affiliated entity; no family or financial co-dependency between signers.
3. **Geographically distributed** — no single-jurisdiction clustering that creates a coercion or seizure choke point.
4. **Technically competent** — demonstrated ability to operate hardware wallets and verify raw transaction calldata.
5. **Accountable** — public statement of duties; subject to Indaba recall.

---

## 32.4 — Spending Tiers & Thresholds

Not every disbursement deserves the same friction. A USDC server invoice should not require a protocol-wide vote; a seven-figure reserve transfer must. YNKLV maps spend size to authorization weight and to time-lock duration. Thresholds are denominated in USD-equivalent and ratified by the Indaba; the bands below are the design baseline.

| Tier | Range (USD-eq) | Vault | Approval | Timelock | Discussion |
|---|---|---|---|---|---|
| T0 — Micro | ≤ 5,000 | Operating | 2-of-N guardians | None | None |
| T1 — Operational | 5,000 – 50,000 | Operating | 3-of-N guardians | 24 h | 48 h public |
| T2 — Significant | 50,000 – 250,000 | Operating / Reserve | Indaba simple majority | 48 h | 72 h public |
| T3 — Major | 250,000 – 1,000,000 | Strategic Reserve | Indaba majority + quorum | 7 days | 14 days public |
| T4 — Strategic | > 1,000,000 | Strategic Reserve | Indaba super-majority + elevated quorum | 14 days | 21 days public |
| T5 — Endowment | Any draw on principal | Endowment | Super-majority, two separate epochs | 30 days | Full epoch review |

**Reading the table.** As stakes rise, three things increase together: the number and independence of approvers, the length of the timelock, and the length of the public discussion window. Friction is intentional and proportional. The timelock is the community's veto window: any participant who sees a malicious or erroneous T3+ transaction has days to raise the alarm, organize, and — if the proposal is illegitimate — trigger the Askari pause before execution.

---

## 32.5 — Time-Locks on Large Transfers

The timelock is the single most important defensive primitive in the treasury. It converts an instantaneous theft into a publicly visible, contestable event with a built-in reaction window.

```
   APPROVAL REACHED ──► TIMELOCK QUEUED ──────────────► EXECUTABLE ──► EXECUTED
        (T+0)              (visible on-chain)              (T+delay)      │
                                  │                                       │
                                  ▼                                       ▼
                          Public dashboard alert                  Recorded in
                          + Zamani Ledger entry                   Zamani Ledger
                                  │
                                  ▼
                          ── REACTION WINDOW ──
                    Community review · Askari pause if exploit ·
                       Indaba cancellation if proposal invalid
```

Properties enforced on the protected vaults (Reserve, Endowment, City Charters):

- **No bypass.** There is no privileged path to skip the delay. Not for the Foundation, not for any quorum of signers.
- **Cancellable.** A queued malicious transaction can be cancelled by the same governance body that could have approved it, or paused by the Askari, before the delay elapses.
- **Visible at queue time, not execution time.** The alert fires the moment a transaction is queued, maximizing the reaction window.

---

## 32.6 — Treasury Diversification Policy

A treasury denominated mostly in its own native token is not a treasury — it is a leveraged bet on its own price, and it fails precisely when the ecosystem most needs it. When the YNKLV token falls, the treasury falls with it, runway evaporates, and the protocol is forced to sell into weakness, deepening the decline. This reflexive trap has destroyed more well-intentioned ecosystems than any smart-contract bug.

YNKLV refuses this trap structurally.

### Target Allocation (Operating + Strategic Reserve)

```
   STABLECOINS (USDC)   ████████████████████████████████  50–65%
   ETH                  ████████████████                  20–30%
   YNKLV (native)       ████████                          10–20%
```

| Asset | Role | Target Band | Rationale |
|---|---|---|---|
| Stablecoins (USDC) | Runway, payroll, grants | 50–65% | Operations must be fundable through any market regime. Bills are paid in stable value. |
| ETH | Productive reserve, gas, Base-native liquidity | 20–30% | Correlated to the chain YNKLV lives on; deep liquidity; serves as a less-correlated growth reserve. |
| YNKLV | Alignment, governance, ecosystem incentives | 10–20% | The treasury must hold the native asset to be aligned — but never enough that its survival depends on the token price. |

**Runway target.** The treasury maintains a minimum of **24 months** of operating runway denominated in stablecoins at all times. Crossing thresholds triggers mandatory governance action:

- Runway falls below **18 months** → automatic Indaba budget-review proposal is queued.
- Runway falls below **12 months** → emergency Indaba session; discretionary spending freezes pending a plan.

**Why over-concentration in YNKLV is dangerous — stated plainly.** If 80% of Baraka were YNKLV and the token halved in a bear market, runway would halve at the exact moment grant demand and stabilization needs peak. The treasury would be forced to liquidate native tokens into a thin, falling market — accelerating the decline it is meant to cushion. Diversification into stable, uncorrelated, and chain-native assets breaks this reflexive loop. The native-token holding is sized to express alignment, not to underwrite survival.

### Rebalancing Governance

Rebalancing is not discretionary trading. It is a governed, banded, transparent process:

1. **Bands, not points.** Allocation is a corridor. Rebalancing is only proposed when an asset drifts outside its band, preventing reactive market timing.
2. **Indaba-approved mandate.** Rebalancing above T2 size follows the same tier/timelock rules as any disbursement.
3. **TWAP and venue discipline.** Large rebalances execute via time-weighted strategies and pre-approved venues to minimize price impact and front-running, with execution parameters published in advance.
4. **No leverage, no exotic yield.** Baraka does not borrow against itself, does not chase mercenary yield, and does not deploy reserves into unaudited or illiquid strategies. Capital preservation precedes return.

---

## 32.7 — The Askari: Emergency Security Council

**The Askari** is the emergency body. Its name and its scope are chosen deliberately: an askari is a guard, not a governor. The Askari exists to stop harm in progress, not to rule.

### Configuration

- **4-of-7 multisig.** Seven independent members; four signatures required to act.
- **Single power: PAUSE.** On verified exploit, the Askari can halt designated protocol functions.
- **Explicitly cannot:** move funds, mint tokens (no mint function exists in any case), alter governance, change parameters, upgrade contracts, or unpause arbitrarily without satisfying the documented recovery path.
- **Sunsets.** As Mboka matures and decentralizes, the Askari's scope and existence are reviewed by the Indaba on a fixed schedule, trending toward dissolution.

```
   THE ASKARI — what it can and cannot touch

   CAN PAUSE                          CANNOT EVER
   ─────────                          ───────────
   ✓ Pausable peripheral modules      ✗ Move or withdraw treasury funds
   ✓ Soko settlement (on exploit)     ✗ Mint tokens (no mint exists)
   ✓ Pass minting (on exploit)        ✗ Cast or override governance votes
   ✓ Bridge endpoints (on exploit)    ✗ Change economic parameters
                                      ✗ Upgrade or replace the core token
                                      ✗ Unpause unilaterally past recovery rules
```

### Pause Discipline

The Askari is constrained on the *enter* and the *exit*:

- **Entering a pause** requires a documented, verifiable exploit indicator — not suspicion, not market movement. The triggering evidence is published to the Zamani Ledger.
- **The immutable core token cannot be paused.** Holders can always transfer their own YNKLV. A pause affects peripheral, exploit-bearing modules — never custody of user assets.
- **Exiting a pause** follows a published recovery procedure with Indaba oversight, preventing a "permanent emergency" capture of the protocol.

### Circuit Breakers — What Can and Cannot Be Halted

| Subsystem | Pausable | Notes |
|---|---|---|
| Core YNKLV token (ERC-20) | **No** | Immutable. User transfers always work. |
| Usage-triggered burn logic | **No** | Tied to immutable core. |
| Soko settlement (creator splits) | Yes, on exploit | 90 / 8.5 / 1.5 split logic itself is hardcoded and immutable; only settlement can pause. |
| Pass minting (Sankofa) | Yes, on exploit | Existing Passes unaffected. |
| Nommo credit redemption | Yes, on exploit | Prevents drain via a credit-pricing exploit. |
| Bridge / cross-chain endpoints | Yes, on exploit | Highest-risk surface; first to halt. |
| Governance execution timelock | Cancel only | Malicious queued tx cancellable; cannot be force-executed. |

---

## 32.8 — Governance-Controlled Treasury Logic

Every unit of value that leaves Baraka is bound to a public mandate. This is enforced by contract, not by policy.

```
   INDABA PROPOSAL ──► VOTE PASSES ──► PROPOSAL ID RECORDED ──► DISBURSEMENT
        │                                      │                     │
        │                                      │                     ▼
        │                                      │              Transaction carries
        │                                      │              proposal ID reference
        │                                      ▼                     │
        └──────────────► ZAMANI LEDGER ◄───────┴─────────────────────┘
                         (permanent, public, queryable)
                                   │
                                   ▼
                      PUBLIC BARAKA DASHBOARD
              balances · runway · allocation vs. budget ·
                  full transaction log · signer activity
```

- **No untraceable spend exists.** A disbursement without a valid, passed proposal ID is rejected at the contract level. There is no manual override.
- **The Baraka dashboard** publishes total value, per-asset breakdown, estimated runway, approved budget vs. actual spend by category, and a searchable transaction log with no minimum threshold — every micro-expense is visible.
- **No dark-pool transactions.** There is no "sign now, explain later." The mandate precedes the money.

---

## 32.9 — Smart-Contract Security Philosophy

YNKLV's contract posture is conservative by design. The institution would rather forgo a feature than introduce an upgrade key.

### Immutability Where It Matters

The following are **final on deployment** — no admin key, no proxy, no upgrade path:

- The YNKLV ERC-20 core: fixed 1,000,000,000 supply, **no mint function**, **no admin key**.
- The usage-triggered burn logic (AI credit use, transfers, Pass minting, governance submissions).
- The Soko value split: **90% creator / 8.5% treasury / 1.5% burn**, hardcoded.

This sacrifices flexibility for trust, and that is the correct trade. An upgradeable token is a token where someone, somewhere, holds a key that can change any rule at any time. No serious participant should be asked to trust that key.

### Minimal Upgradeability Surface

Where evolution is genuinely required (peripheral modules — new Nommo faculties, new Soko features), upgradeability is:

- **Bounded** to clearly-scoped, non-custodial modules that cannot reach into the immutable core.
- **Governed** — every upgrade is an Indaba proposal subject to T-tier timelocks.
- **Auditable** — the diff is published before the timelock elapses, so reviewers see exactly what changes.

### Defense-in-Depth Disciplines

| Discipline | Practice |
|---|---|
| Reentrancy | Checks-Effects-Interactions ordering; reentrancy guards on all external-call paths; pull-over-push for value transfers. |
| Access control | Least privilege; role-based authorization; no `tx.origin`; no implicit owner; explicit recusal logic in proposal/approval split. |
| Oracle safety | TWAP and multi-source aggregation; staleness and deviation bounds; circuit-break on oracle anomaly; never a single spot-price dependency. |
| Arithmetic | Native checked math; explicit bounds on credit pricing and split arithmetic; invariant assertions. |
| Upgrade safety | Storage-layout discipline; timelocked, governed, diffed upgrades only; immutable core untouchable. |
| Input validation | Strict validation on all external entry points; fail closed. |

---

## 32.10 — Audit Strategy

A single audit is a snapshot, not assurance. YNKLV treats security as a continuous program.

### Pre-Launch — Two Independent Audits Minimum

- **Audit A — top-tier firm** (e.g., Trail of Bits or equivalent). Scope: core token, treasury vaults, timelock, Soko split, Pass. 4–6 weeks. Full public report across all severities. **All critical and high findings resolved before mainnet.**
- **Audit B — competitive audit** (e.g., Code4rena or Sherlock). Hundreds of independent researchers, broad and adversarial coverage. Run after Audit A findings are remediated, so the competitive crowd attacks a hardened target.

The two are complementary: the firm gives depth and methodological rigor; the competition gives breadth and diversity of attack imagination.

### Formal Verification for Critical Invariants

For the highest-stakes properties, prose review is supplemented with machine-checked proofs:

| Invariant | Property to prove |
|---|---|
| Supply | Total supply only ever decreases (burns) and never exceeds 1,000,000,000. No mint path exists. |
| Soko split | Settlement always distributes exactly 90 / 8.5 / 1.5; no rounding leak; no path that diverts creator share. |
| Timelock | No queued transaction can execute before its delay; no privileged bypass exists. |
| Askari scope | Pause functions cannot transfer value, mint, or alter governance. |

### Continuous Security

- **Bug bounty (tiered, e.g., ImmuneFi):**

  | Severity | Reward (USDC-eq) | First response | Fix SLA |
  |---|---|---|---|
  | Critical | up to 50,000+ | 24 h | 14 days |
  | High | up to 20,000 | 24 h | 30 days |
  | Medium | up to 5,000 | 72 h | 30 days |
  | Low | up to 1,000 | 72 h | best-effort |

- **Continuous review** of every new peripheral module before it ships; fresh-eyes auditor rotation year over year.
- **Monitoring** — automated anomaly detection on treasury flows, burn rates, oracle deviation, and bridge activity, wired to the Askari pause path.

---

## 32.11 — Operational Security Culture

Most losses in this industry are not clever cryptographic breaks. They are stolen keys, signed phishing transactions, and one over-trusted human. YNKLV's operational posture targets exactly these failure modes.

### Key Management

- **Hardware-backed signing.** Every guardian and Askari signer uses a dedicated hardware wallet or HSM. Private keys never touch an internet-connected general-purpose machine.
- **Geographic and jurisdictional distribution.** Signers and their keys are spread so that no single seizure, outage, or coercion event can assemble a threshold.
- **No shared keys, no shared seeds.** One key, one human, one device.

### Signer Hygiene

- **Calldata verification, not UI trust.** Signers verify raw transaction calldata against the published proposal — never approve on a label alone (the "blind-signing" failure).
- **Dedicated signing devices.** Signing is performed on hardened, single-purpose devices, not on daily-use machines.
- **Mandatory key rotation** on any suspicion of compromise and on signer turnover.

### Social-Engineering Defenses

- **Out-of-band confirmation.** Unusual or urgent requests are confirmed through a second, pre-agreed channel. Urgency is treated as a red flag, not a reason to move faster.
- **No unilateral capability exists to exploit.** Because separation of duty and threshold signing are enforced, a single compromised or coerced individual cannot move funds even under perfect deception.
- **Defined incident playbook** — who is contacted, in what order, and which functions the Askari pauses first.

### No Single Human Bottleneck

No founder, no executive, no Foundation officer can act alone on Baraka. The architecture removes the very existence of a "trusted insider" who could be bribed, coerced, mistaken, or compromised. Where there is no single point of authority, there is no single point of failure.

---

## 32.12 — Anti-Manipulation Systems (Governance Defense)

A treasury controlled by governance is only as safe as the governance is hard to capture. The Indaba is engineered against the known attacks.

| Attack | Mechanism | Mitigation |
|---|---|---|
| Vote-buying / bribery | Pay holders to vote a direction | **EPS-weighting** ties voting power to earned reputation (Sankofa), hold duration, and genuine activity — not transferable token balance alone. Reputation is non-transferable, so it cannot be purchased. |
| Flash-loan governance | Borrow tokens, vote, repay in one block | **Snapshot at proposal creation** plus minimum hold/lock duration. A balance held for one block carries no weight. |
| Proposal spam / griefing | Flood governance to exhaust attention | **Burn-on-submission** (governance submissions trigger a YNKLV burn) imposes a real cost; minimum EPS threshold to propose. |
| Last-minute swing | Acquire stake just before close | Snapshot weighting + long discussion windows neutralize late accumulation. |
| Quiet capture | Pass a malicious treasury proposal | **Quorum + timelock + public discussion**: even a passed T3+ proposal sits in the timelock long enough for the community to detect and the Askari to pause. |
| Plutocracy | Whales dominate linearly | EPS-weighting and reputation curves blunt pure-capital dominance; power must be earned, not merely bought. |

The defensive stack composes: **quorum** ensures legitimacy, **EPS-weighting** ensures power is earned, **snapshots** defeat borrowed power, **burns** price out spam, and the **timelock** guarantees a reaction window even if a malicious proposal somehow passes. No single layer is trusted to hold alone.

---

## 32.13 — Attack Surface & Mitigations

A complete, frank enumeration of how YNKLV could be attacked, and the specific structural answer to each. This section is written for the auditor who skips to the threats first.

### Smart-Contract Risk
*A bug in protocol code enables theft, lock-up, or unintended behavior.*
**Mitigation:** Immutable, minimal core with no mint and no admin key; checks-effects-interactions and reentrancy guards; ≥2 independent audits (firm + competitive) with all critical/high resolved pre-launch; formal verification of supply, split, and timelock invariants; bounded, governed, diffed upgradeability on peripheral modules only; continuous bug bounty.

### Governance-Attack Risk
*An adversary captures the Indaba to redirect Baraka.*
**Mitigation:** EPS-weighting (earned, non-transferable reputation) over raw token balance; snapshot-at-proposal to defeat flash loans and late accumulation; burn-on-submission and EPS thresholds against spam; quorum, super-majority bands for large spends, and timelocks that preserve an Askari/community reaction window even on a passed proposal.

### Treasury Risk
*Reserves are lost to theft, mismanagement, or reflexive collapse.*
**Mitigation:** Segregated tiered vaults (compromise of the hot vault exposes only a bounded balance); diversification policy capping native-token concentration; 24-month stablecoin runway floor with automatic governance triggers; banded, TWAP-disciplined, governed rebalancing; no leverage and no mercenary yield; timelocks on all large transfers.

### Social-Engineering Risk
*A human is deceived or coerced into a harmful action.*
**Mitigation:** Hardware/HSM signing with calldata verification (no blind signing); out-of-band confirmation for unusual requests; separation of propose/approve/execute so no deceived individual can act alone; defined incident playbook; mandatory rotation on suspicion.

### Operational-Bottleneck Risk
*A single person, key, or jurisdiction is a point of failure.*
**Mitigation:** Threshold multisig everywhere (no unilateral capability); geographic and jurisdictional distribution of signers and keys; one-key-one-human-one-device; an executor that is a contract, not a person.

### Oracle Risk
*A manipulated price feed corrupts credit pricing, splits, or rebalancing.*
**Mitigation:** TWAP and multi-source aggregation with staleness and deviation bounds; never a single spot-price dependency; automatic circuit-break to the Askari pause path on oracle anomaly; oracle-derived parameters bounded so an anomaly cannot drain a vault before pause.

### Scaling Risk
*Growth on Base or a bridge introduces new, higher-risk surface.*
**Mitigation:** Bridges and cross-chain endpoints are the first subsystems to pause on exploit; conservative bounded exposure on any bridge; new modules ship only after audit and only behind governance and timelocks; the immutable core never depends on a bridge for custody.

---

## 32.14 — Summary

Baraka is a commons, not a war chest — segregated into hot, reserve, endowment, and charter vaults so that no single compromise reaches the principal. Authority is split three ways: proposers cannot approve, approvers cannot self-execute, and the executor is a timelock, not a human. Large transfers wait in public, where the community can see them and the Askari can stop a verified exploit — but the Askari can only ever pause, never seize, mint, or govern. The treasury holds stable, uncorrelated, and native assets in deliberate proportion, with a 24-month runway floor, so that YNKLV is strongest precisely when markets are weakest.

This is what *Tobongisa Mboka* requires of its keepers: a homeland defended not by walls, but by the discipline of how few hands can act alone, and how little can be hidden.

---

*"The strongest treasury is not the one that cannot be attacked. It is the one where every attack is slow, visible, and survivable — and where no single person was ever trusted to be incorruptible."*
