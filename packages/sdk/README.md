# @ynklv/sdk

Connect any application to the YNKLV ecosystem in minutes — balances, membership
tiers, token-gating, contribution scores, rewards, identity, and Soko checkout.

> YNKLV is a **utility** ecosystem. This SDK exposes access, membership, and
> participation. It exposes **no** yield, APY, or investment surface — by design.

## Install

```bash
pnpm add @ynklv/sdk viem
# react is an optional peer dependency for the hooks entry point
```

## Quick start (framework-agnostic)

```ts
import { createYnklvClient, Gates } from '@ynklv/sdk'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createYnklvClient({
  chainId: 8453,
  apiBaseUrl: 'https://api.ynklv.xyz',
  publicClient: createPublicClient({ chain: base, transport: http() }),
  addresses: {
    ynklvToken: '0x…',
    membershipRegistry: '0x…',
  },
})

const balance = await client.getBalance('0xUser…')
const gate = await client.checkGate('0xUser…', Gates.creator())
if (gate.granted) {
  // unlock the Nommo creative faculties
}
```

## React

```tsx
import { YnklvProvider, useYnklvMembership, useYnklvGate } from '@ynklv/sdk/react'
import { Gates } from '@ynklv/sdk'

function App() {
  return (
    <YnklvProvider client={client}>
      <CreatorTools address="0xUser…" />
    </YnklvProvider>
  )
}

function CreatorTools({ address }) {
  const { data: gate, loading } = useYnklvGate(address, Gates.creator())
  if (loading) return <Spinner />
  if (!gate?.granted) return <Locked reason={gate?.reason} />
  return <Studio />
}
```

### Hooks

| Hook | Returns |
|---|---|
| `useYnklvBalance(address)` | `bigint` balance (wei) |
| `useYnklvMembership(address)` | `MembershipStatus` (tier, score, epoch, city) |
| `useYnklvGate(address, rule)` | `TokenGateResult` (UX-side check) |
| `useYnklvContributionScore(address)` | `ContributionScore` (Sankofa / EPS) |
| `useYnklvRewards(address)` | `RewardHistory` (utility recognition) |
| `useYnklvIdentity(address)` | membership + creator profile |
| `useYnklvCheckout()` | imperative `createCheckout(...)` |

All async hooks return `{ data, loading, error, refetch }`.

## Server-side enforcement

Client-side `checkGate` is for UX. **The server is authoritative.**

```ts
import { createServerClient, requireAccess, withAccess } from '@ynklv/sdk/server'
import { Gates } from '@ynklv/sdk'

const server = createServerClient({ chainId: 8453, apiBaseUrl: process.env.API_URL! })

export const GET = withAccess(
  server,
  Gates.creator(),
  (req) => req.headers.get('x-ynklv-address') as `0x${string}` | null,
  async () => Response.json({ data: 'creator-only resource' }),
)
```

## Token-gating rules

```ts
import { Gates } from '@ynklv/sdk'

Gates.member()                       // Builder tier or higher
Gates.creator()                      // Creator tier (full Nommo faculties)
Gates.architect()                    // Council-level
Gates.balance('100000000000000000000') // ≥ 100 YNKLV
Gates.city('lagos')                  // Lagos City Charter members
```

## Referrals

```ts
const link = client.referralLink('https://ynklv.xyz/join', {
  referrer: '0xYou…',
  campaign: 'lagos-genesis',
})
```

Referrals award **contribution credit** (Sankofa), never financial commission.
