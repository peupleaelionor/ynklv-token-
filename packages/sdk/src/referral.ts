/**
 * Referral links. Referrals recognize community-building contribution; they
 * carry NO financial promise to either party — only Sankofa contribution credit.
 */

import type { Address } from '@ynklv/types'

export interface ReferralParams {
  referrer: Address
  /** Optional campaign or city tag for attribution. */
  campaign?: string
}

/**
 * Builds a referral URL. The referrer address is encoded as `ref`; an optional
 * campaign as `c`. No tracking beyond contribution attribution is implied.
 */
export function generateReferralLink(baseUrl: string, params: ReferralParams): string {
  const url = new URL(baseUrl)
  url.searchParams.set('ref', params.referrer)
  if (params.campaign) url.searchParams.set('c', params.campaign)
  return url.toString()
}

/** Parses referral params from a URL or query string. */
export function parseReferral(input: string): ReferralParams | null {
  let search: URLSearchParams
  try {
    search = input.includes('?')
      ? new URL(input, 'https://ynklv.xyz').searchParams
      : new URLSearchParams(input)
  } catch {
    return null
  }
  const referrer = search.get('ref')
  if (!referrer || !/^0x[a-fA-F0-9]{40}$/.test(referrer)) return null
  const campaign = search.get('c') ?? undefined
  return { referrer: referrer as Address, campaign }
}
