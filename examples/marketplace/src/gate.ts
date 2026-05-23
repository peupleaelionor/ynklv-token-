/**
 * Marketplace — server-side access gate example.
 *
 * Use @ynklv/sdk/server to enforce token gates in Next.js
 * API routes or middleware without leaking gate logic to the client.
 */

import { YnklvClient } from '@ynklv/sdk'
import { requireAccess } from '@ynklv/sdk/server'
import { Gates } from '@ynklv/token-gates'
import { NextRequest, NextResponse } from 'next/server'

const client = new YnklvClient({
  apiBaseUrl: process.env.YNKLV_API_URL ?? 'http://localhost:3001',
})

// Protect a marketplace listing endpoint — Creator tier required.
export async function GET(req: NextRequest) {
  const address = req.headers.get('x-member-address') ?? undefined

  const result = await requireAccess(client, address, Gates.creator())

  if (!result.granted) {
    return NextResponse.json(
      { error: { code: 'ACCESS_DENIED', message: result.reason } },
      { status: 403 },
    )
  }

  // Proceed with marketplace data
  return NextResponse.json({
    data: {
      listings: [],
      memberTier: result.tier,
    },
  })
}
