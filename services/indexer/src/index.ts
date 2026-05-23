import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { watchTransfers } from './watchers/transfers.js'
import { watchRewards } from './watchers/rewards.js'
import { watchContributions } from './watchers/contributions.js'
import { watchSales } from './watchers/sales.js'

const IS_MOCK = process.env.MOCK === '1'
const CHAIN_ID = Number(process.env.CHAIN_ID ?? 84532)
const RPC_URL = process.env.RPC_URL ?? (CHAIN_ID === 8453 ? 'https://mainnet.base.org' : 'https://sepolia.base.org')

// Contract addresses — set via env in production.
const TOKEN_ADDRESS = (process.env.TOKEN_ADDRESS ?? '0x0000000000000000000000000000000000000001') as `0x${string}`
const VAULT_ADDRESS = (process.env.VAULT_ADDRESS ?? '0x0000000000000000000000000000000000000002') as `0x${string}`
const REGISTRY_ADDRESS = (process.env.REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000003') as `0x${string}`
const DISTRIBUTOR_ADDRESS = (
  process.env.DISTRIBUTOR_ADDRESS ?? '0x0000000000000000000000000000000000000004'
) as `0x${string}`

async function main() {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      msg: 'YNKLV Indexer starting',
      chainId: CHAIN_ID,
      mock: IS_MOCK,
    }),
  )

  if (IS_MOCK) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), msg: 'MOCK mode — no live RPC calls, dry run only' }))
    // Emit synthetic events to verify watcher logic without a live chain.
    const mockEvents = [
      { type: 'transfer', from: '0xabc', to: '0xdef', amount: '1000000000000000000' },
      { type: 'reward:allocated', member: '0xabc', amount: '500000000000000000', epoch: 'epoch-2024-q2' },
      { type: 'contribution', member: '0xabc', delta: '100', newScore: '1100' },
    ]
    for (const e of mockEvents) {
      console.log(JSON.stringify({ ts: new Date().toISOString(), mock: true, event: e }))
    }
    console.log(JSON.stringify({ ts: new Date().toISOString(), msg: 'MOCK dry run complete' }))
    return
  }

  const chain = CHAIN_ID === 8453 ? base : baseSepolia
  const client = createPublicClient({ chain, transport: http(RPC_URL) })

  const unsubscribers = await Promise.all([
    watchTransfers(client, TOKEN_ADDRESS),
    watchRewards(client, VAULT_ADDRESS),
    watchContributions(client, REGISTRY_ADDRESS),
    watchSales(client, DISTRIBUTOR_ADDRESS),
  ])

  console.log(JSON.stringify({ ts: new Date().toISOString(), msg: 'All watchers active' }))

  const shutdown = () => {
    console.log(JSON.stringify({ ts: new Date().toISOString(), msg: 'Shutting down indexer' }))
    for (const unsub of unsubscribers) unsub()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main().catch((err) => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), error: err.message }))
  process.exit(1)
})
