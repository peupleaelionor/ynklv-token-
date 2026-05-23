/**
 * @ynklv/token-gates — Pure, isomorphic access-evaluation logic.
 *
 * Gating describes ACCESS to tools, content, and participation. It never
 * implies financial return. The same evaluation runs on the client (for UX)
 * and the server (for enforcement). The server result is authoritative.
 */

import {
  MembershipTier,
  MEMBERSHIP_TIER_NAMES,
  type Address,
  type TokenAmountWei,
  type TokenGateRule,
  type TokenGateResult,
} from '@ynklv/types'
import { tierFor, tierDefinition } from '@ynklv/config'

export interface GateSubject {
  address: Address
  balanceWei: TokenAmountWei
  contributionScore: number
  city?: string
}

/**
 * Evaluates whether a subject satisfies a gate rule. Pure and deterministic.
 */
export function evaluateGate(subject: GateSubject, rule: TokenGateRule): TokenGateResult {
  const balance = BigInt(subject.balanceWei || '0')
  const tier = tierFor(balance, subject.contributionScore)

  const evaluated = {
    balanceWei: subject.balanceWei,
    tier,
    contributionScore: subject.contributionScore,
    city: subject.city,
  }

  // Each clause that is present must pass.
  if (rule.minBalanceWei !== undefined && balance < BigInt(rule.minBalanceWei)) {
    return deny(rule, evaluated, 'Insufficient YNKLV balance for this access.')
  }
  if (rule.minTier !== undefined && tier < rule.minTier) {
    return deny(
      rule,
      evaluated,
      `Requires ${MEMBERSHIP_TIER_NAMES[rule.minTier]} tier or higher.`,
    )
  }
  if (
    rule.minContributionScore !== undefined &&
    subject.contributionScore < rule.minContributionScore
  ) {
    return deny(rule, evaluated, 'Insufficient contribution score (Sankofa).')
  }
  if (rule.requireCity !== undefined && subject.city !== rule.requireCity) {
    return deny(rule, evaluated, `Requires membership in the ${rule.requireCity} City Charter.`)
  }

  return { granted: true, rule, evaluated }
}

function deny(
  rule: TokenGateRule,
  evaluated: TokenGateResult['evaluated'],
  reason: string,
): TokenGateResult {
  return { granted: false, rule, reason, evaluated }
}

/**
 * Describes, in human terms, what a subject must do to satisfy a failed gate.
 * Useful for "locked" UI states that respect the user.
 */
export function describeShortfall(subject: GateSubject, rule: TokenGateRule): string | null {
  const result = evaluateGate(subject, rule)
  if (result.granted) return null
  return result.reason ?? 'Access requirements not met.'
}

// ─── Common rule presets ─────────────────────────────────────────────────────

export const Gates = {
  /** Anyone holding the minimum to mint a Pass. */
  member: (): TokenGateRule => ({ minTier: MembershipTier.Builder }),
  /** Full Nommo creative faculties. */
  creator: (): TokenGateRule => ({ minTier: MembershipTier.Creator }),
  /** Council-level participation. */
  architect: (): TokenGateRule => ({ minTier: MembershipTier.Architect }),
  /** Custom balance gate. */
  balance: (minBalanceWei: TokenAmountWei): TokenGateRule => ({ minBalanceWei }),
  /** Geographic gate to a chartered city. */
  city: (city: string, minTier = MembershipTier.Builder): TokenGateRule => ({
    requireCity: city,
    minTier,
  }),
} as const

export { tierDefinition }
