/**
 * AI SaaS — Nommo-powered feature gate example.
 *
 * Demonstrates how an AI-native product (e.g. a music generation
 * SaaS) gates premium features behind Architect-tier membership.
 *
 * Nommo proposes — humans decide. AI features are advisory only.
 */

import { YnklvClient } from '@ynklv/sdk'
import { requireAccess } from '@ynklv/sdk/server'
import { Gates } from '@ynklv/token-gates'

const client = new YnklvClient({
  apiBaseUrl: process.env.YNKLV_API_URL ?? 'http://localhost:3001',
})

export async function requireArchitectAccess(address?: string) {
  return requireAccess(client, address, Gates.architect())
}

// Example: AI music generation endpoint guard
export async function generateWithNommo(address: string, prompt: string) {
  const access = await requireArchitectAccess(address)
  if (!access.granted) {
    throw new Error(`Access denied: ${access.reason}. Architect tier required for Nommo AI features.`)
  }

  // Nommo integration point — all outputs are advisory.
  // Production: call your AI model here and wrap results in
  // a "Nommo proposes, you decide" UX pattern.
  return {
    proposal: `[Nommo advisory] Based on "${prompt}": afrobeat stem at 105 BPM with kora and mbira elements.`,
    confidence: 0.87,
    notice: 'This is an AI proposal. Review and decide before publishing.',
  }
}
