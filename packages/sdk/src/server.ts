/**
 * @ynklv/sdk/server — Server-side access enforcement.
 *
 * Use these in Next.js Route Handlers, Server Components, and middleware to
 * enforce token-gates authoritatively. The client-side `checkGate` is for UX;
 * THIS is the source of truth.
 */

import type { Address, TokenGateRule, TokenGateResult, MembershipStatus } from '@ynklv/types'
import { YnklvClient, type YnklvClientConfig } from './client.js'

/** Creates a server client. Keep auth tokens server-only. */
export function createServerClient(config: YnklvClientConfig): YnklvClient {
  return new YnklvClient(config)
}

export interface RequireAccessResult {
  granted: boolean
  status: number
  result: TokenGateResult
}

/**
 * Authoritatively evaluates whether `address` may access a resource.
 * Returns an HTTP-friendly shape for route handlers.
 */
export async function requireAccess(
  client: YnklvClient,
  address: Address | undefined | null,
  rule: TokenGateRule,
): Promise<RequireAccessResult> {
  if (!address) {
    return {
      granted: false,
      status: 401,
      result: {
        granted: false,
        rule,
        reason: 'No wallet connected.',
        evaluated: { balanceWei: '0', tier: 0, contributionScore: 0 },
      },
    }
  }
  const result = await client.checkGate(address, rule)
  return { granted: result.granted, status: result.granted ? 200 : 403, result }
}

/** Server-side membership fetch (e.g. for RSC personalization). */
export async function getServerMembership(
  client: YnklvClient,
  address: Address,
): Promise<MembershipStatus> {
  return client.getMembership(address)
}

/**
 * Higher-order guard for Next.js Route Handlers.
 *
 * @example
 * export const GET = withAccess(client, Gates.creator(), getAddr, async (req) => {
 *   return Response.json({ secret: 'creator-only' })
 * })
 */
export function withAccess<Req extends Request>(
  client: YnklvClient,
  rule: TokenGateRule,
  getAddress: (req: Req) => Address | undefined | null | Promise<Address | undefined | null>,
  handler: (req: Req) => Response | Promise<Response>,
) {
  return async (req: Req): Promise<Response> => {
    const address = await getAddress(req)
    const { granted, status, result } = await requireAccess(client, address, rule)
    if (!granted) {
      return new Response(
        JSON.stringify({ error: { code: 'ACCESS_DENIED', message: result.reason } }),
        { status, headers: { 'content-type': 'application/json' } },
      )
    }
    return handler(req)
  }
}
