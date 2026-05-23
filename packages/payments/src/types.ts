/**
 * @ynklv/payments — provider-agnostic interfaces.
 *
 * ──────────────────────────────────────────────────────────────────────────
 *  COMPLIANCE NOTICE
 *  - EUR (and any fiat) on/off-ramp is performed EXCLUSIVELY by LICENSED
 *    third-party providers. YNKLV operates NO internal custodial exchange.
 *  - KYC/AML is performed by the licensed provider where legally required.
 *  - Nothing here promises profit, yield, or investment return. Payments buy
 *    ACCESS, MEMBERSHIP, and CREATOR PRODUCTS — utility, not speculation.
 *  - These are integration ABSTRACTIONS. Real adapters must be implemented and
 *    operated only under the appropriate licenses and legal review.
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { Address } from '@ynklv/types'

export type FiatCurrency = 'EUR' | 'USD' | 'GBP' | 'NGN' | 'KES' | 'XOF'
export type CryptoAsset = 'YNKLV' | 'USDC' | 'ETH'

export interface Money {
  amount: string // decimal string
  currency: FiatCurrency | CryptoAsset
}

export interface ComplianceContext {
  /** Whether the provider requires KYC for this flow/amount. */
  kycRequired: boolean
  /** Provider's regulatory licence reference, surfaced for transparency. */
  providerLicence?: string
  jurisdiction?: string
}

// ─── On-ramp (fiat → crypto, via licensed provider) ───────────────────────────

export interface OnRampQuote {
  spend: Money
  receive: Money
  feeAmount: string
  provider: string
  compliance: ComplianceContext
  expiresAt: string
}

export interface OnRampSession {
  id: string
  /** Hosted, provider-operated checkout URL (provider handles KYC + custody). */
  redirectUrl: string
  status: 'created' | 'pending' | 'completed' | 'failed'
}

export interface OnRampProvider {
  readonly name: string
  /** Quote a fiat→crypto purchase delivered to `destination`. */
  quote(input: {
    spend: Money
    target: CryptoAsset
    destination: Address
  }): Promise<OnRampQuote>
  /** Create a provider-hosted on-ramp session. */
  createSession(input: {
    spend: Money
    target: CryptoAsset
    destination: Address
    returnUrl: string
  }): Promise<OnRampSession>
}

// ─── Off-ramp (crypto → fiat, via licensed provider) ──────────────────────────

export interface OffRampProvider {
  readonly name: string
  quote(input: { sell: Money; target: FiatCurrency }): Promise<OnRampQuote>
  createSession(input: {
    sell: Money
    target: FiatCurrency
    source: Address
    returnUrl: string
  }): Promise<OnRampSession>
}

// ─── Checkout (crypto/stablecoin or hosted fiat for non-token products) ───────

export interface CheckoutSession {
  id: string
  /** For on-chain settlement: pay-to address + asset. For fiat: hosted URL. */
  payTo?: Address
  asset?: CryptoAsset
  redirectUrl?: string
  amount: Money
  status: 'created' | 'pending' | 'paid' | 'expired' | 'cancelled'
  expiresAt: string
}

export interface CheckoutProvider {
  readonly name: string
  /** Crypto/stablecoin checkout (on-chain settlement). */
  createCryptoCheckout(input: {
    amount: Money
    payTo: Address
    metadata?: Record<string, string>
  }): Promise<CheckoutSession>
  /** Hosted fiat checkout for NON-token products (e.g. merch, events). */
  createFiatCheckout(input: {
    amount: Money
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
  }): Promise<CheckoutSession>
}

// ─── Price quotes (display only) ──────────────────────────────────────────────

export interface PriceQuoteProvider {
  readonly name: string
  /** Indicative price for display only — never a solicitation or guarantee. */
  quote(input: { base: CryptoAsset; quote: FiatCurrency }): Promise<{
    price: string
    asOf: string
    disclaimer: string
  }>
}

// ─── Compliance hook ───────────────────────────────────────────────────────

export interface ComplianceProvider {
  readonly name: string
  /** Returns whether a flow may proceed and what disclosures to show. */
  evaluate(input: {
    address: Address
    flow: 'onramp' | 'offramp' | 'checkout'
    amount: Money
    jurisdiction?: string
  }): Promise<{
    allowed: boolean
    kycRequired: boolean
    disclosures: string[]
    reason?: string
  }>
}
