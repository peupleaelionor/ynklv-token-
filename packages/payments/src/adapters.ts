/**
 * Adapter scaffolds for payment providers.
 *
 * These are INTEGRATION PLACEHOLDERS. Each documents the real provider it maps
 * to and throws until configured with credentials AND the appropriate licences
 * and legal review are in place. They exist so app code can be written against
 * stable interfaces today and wired to live providers later.
 */

import { COMPLIANCE_DISCLOSURES } from './compliance.js'
import type {
  CheckoutProvider,
  CheckoutSession,
  ComplianceProvider,
  Money,
  OffRampProvider,
  OnRampProvider,
  OnRampQuote,
  OnRampSession,
  PriceQuoteProvider,
} from './types.js'
import type { Address } from '@ynklv/types'

class NotConfiguredError extends Error {
  constructor(provider: string, hint: string) {
    super(`[${provider}] not configured. ${hint}`)
    this.name = 'NotConfiguredError'
  }
}

// ─── Coinbase Commerce / OnchainKit-style crypto checkout ─────────────────────

export interface CoinbaseCheckoutConfig {
  apiKey?: string
  baseUrl?: string
}

/** Maps to Coinbase Commerce / OnchainKit charge flows. */
export function coinbaseCheckout(config: CoinbaseCheckoutConfig = {}): CheckoutProvider {
  const ensure = () => {
    if (!config.apiKey) {
      throw new NotConfiguredError(
        'coinbase-checkout',
        'Provide COINBASE_COMMERCE_API_KEY and review Coinbase Commerce terms.',
      )
    }
  }
  return {
    name: 'coinbase-commerce',
    async createCryptoCheckout({ amount, payTo, metadata }): Promise<CheckoutSession> {
      ensure()
      // Real impl: POST /charges to Coinbase Commerce; return hosted_url.
      return stubCheckout(amount, { payTo, metadata })
    },
    async createFiatCheckout(): Promise<CheckoutSession> {
      throw new NotConfiguredError(
        'coinbase-checkout',
        'Use the Stripe adapter for hosted fiat checkout of non-token products.',
      )
    },
  }
}

// ─── Stripe — hosted fiat checkout for NON-token products only ────────────────

export interface StripeConfig {
  secretKey?: string
}

/**
 * Stripe Checkout for non-token products (merch, event tickets, SaaS seats).
 * NEVER used to sell YNKLV directly — token acquisition uses a licensed ramp.
 */
export function stripeCheckout(config: StripeConfig = {}): CheckoutProvider {
  const ensure = () => {
    if (!config.secretKey) {
      throw new NotConfiguredError('stripe', 'Provide STRIPE_SECRET_KEY.')
    }
  }
  return {
    name: 'stripe',
    async createCryptoCheckout(): Promise<CheckoutSession> {
      throw new NotConfiguredError('stripe', 'Stripe is for fiat checkout of non-token products.')
    },
    async createFiatCheckout({ amount, successUrl, cancelUrl, metadata }): Promise<CheckoutSession> {
      ensure()
      // Real impl: stripe.checkout.sessions.create({ ... }); return url.
      void successUrl
      void cancelUrl
      return stubCheckout(amount, { metadata, hosted: true })
    },
  }
}

// ─── Regulated on-ramp placeholder (fiat → crypto) ────────────────────────────

export interface RegulatedOnRampConfig {
  apiKey?: string
  /** The licensed provider's regulatory reference, surfaced for transparency. */
  providerLicence?: string
  jurisdiction?: string
}

/**
 * Placeholder for a LICENSED fiat on-ramp (e.g. a MiCA-authorised provider).
 * The provider performs KYC/AML and custody. YNKLV never touches fiat custody.
 */
export function regulatedOnRamp(config: RegulatedOnRampConfig = {}): OnRampProvider {
  const ensure = () => {
    if (!config.apiKey || !config.providerLicence) {
      throw new NotConfiguredError(
        'regulated-onramp',
        'A licensed, MiCA-aware provider with a verifiable licence reference is required.',
      )
    }
  }
  return {
    name: 'regulated-onramp',
    async quote({ spend, target }): Promise<OnRampQuote> {
      ensure()
      return stubQuote(spend, target, config)
    },
    async createSession({ returnUrl }): Promise<OnRampSession> {
      ensure()
      void returnUrl
      // Real impl returns the provider-hosted, KYC-gated checkout URL.
      return { id: stubId('onramp'), redirectUrl: 'https://provider.example/kyc', status: 'created' }
    },
  }
}

// ─── Stablecoin payment placeholder (USDC on Base) ────────────────────────────

export function stablecoinCheckout(usdcAddress?: Address): CheckoutProvider {
  return {
    name: 'stablecoin',
    async createCryptoCheckout({ amount, payTo, metadata }): Promise<CheckoutSession> {
      if (!usdcAddress) {
        throw new NotConfiguredError('stablecoin', 'Provide the USDC token address for the chain.')
      }
      return { ...stubCheckout(amount, { payTo, metadata }), asset: 'USDC' }
    },
    async createFiatCheckout(): Promise<CheckoutSession> {
      throw new NotConfiguredError('stablecoin', 'Stablecoin adapter settles on-chain only.')
    },
  }
}

// ─── Off-ramp placeholder (crypto → fiat) ─────────────────────────────────────

export function regulatedOffRamp(config: RegulatedOnRampConfig = {}): OffRampProvider {
  const ensure = () => {
    if (!config.apiKey || !config.providerLicence) {
      throw new NotConfiguredError('regulated-offramp', 'A licensed provider is required.')
    }
  }
  return {
    name: 'regulated-offramp',
    async quote({ sell }): Promise<OnRampQuote> {
      ensure()
      return stubQuote(sell, 'YNKLV', config)
    },
    async createSession({ returnUrl }): Promise<OnRampSession> {
      ensure()
      void returnUrl
      return { id: stubId('offramp'), redirectUrl: 'https://provider.example/kyc', status: 'created' }
    },
  }
}

// ─── Price quote placeholder (display only) ──────────────────────────────────

export function priceQuoteProvider(): PriceQuoteProvider {
  return {
    name: 'price-quote',
    async quote({ base, quote }) {
      return {
        price: '0',
        asOf: new Date().toISOString(),
        disclaimer: `Indicative ${base}/${quote} price for display only. Not a solicitation, offer, or guarantee of value.`,
      }
    },
  }
}

// ─── Default compliance provider ──────────────────────────────────────────────

export function defaultComplianceProvider(): ComplianceProvider {
  return {
    name: 'ynklv-compliance',
    async evaluate({ flow }) {
      const kycRequired = flow === 'onramp' || flow === 'offramp'
      return {
        allowed: true,
        kycRequired,
        disclosures: COMPLIANCE_DISCLOSURES,
      }
    },
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function stubId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function stubCheckout(
  amount: Money,
  opts: { payTo?: Address; metadata?: Record<string, string>; hosted?: boolean } = {},
): CheckoutSession {
  return {
    id: stubId('chk'),
    amount,
    payTo: opts.payTo,
    redirectUrl: opts.hosted ? 'https://hosted.example/checkout' : undefined,
    status: 'created',
    expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
  }
}

function stubQuote(spend: Money, target: string, config: RegulatedOnRampConfig): OnRampQuote {
  return {
    spend,
    receive: { amount: '0', currency: target as Money['currency'] },
    feeAmount: '0',
    provider: 'regulated-provider',
    compliance: {
      kycRequired: true,
      providerLicence: config.providerLicence,
      jurisdiction: config.jurisdiction,
    },
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  }
}
