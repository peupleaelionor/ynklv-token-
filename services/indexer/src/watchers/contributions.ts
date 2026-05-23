import { PublicClient, parseAbiItem } from 'viem'
import { db } from '../db/index.js'

const contributionEvent = parseAbiItem(
  'event ContributionUpdated(address indexed member, uint256 newScore, int256 delta)',
)

export async function watchContributions(client: PublicClient, registryAddress: `0x${string}`) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), watcher: 'contributions', contract: registryAddress }))

  return client.watchEvent({
    address: registryAddress,
    event: contributionEvent,
    onLogs: (logs) => {
      for (const log of logs) {
        if (db.isDuplicate(log.transactionHash ?? '', log.logIndex ?? 0)) continue
        db.insert('contribution_events', {
          txHash: log.transactionHash ?? '',
          logIndex: log.logIndex ?? 0,
          blockNumber: log.blockNumber ?? 0n,
          blockTime: new Date(),
          memberAddress: (log.args.member ?? '').toLowerCase(),
          newScore: log.args.newScore?.toString() ?? '0',
          delta: log.args.delta?.toString() ?? '0',
        })
      }
    },
    onError: (err) => {
      console.error(JSON.stringify({ ts: new Date().toISOString(), watcher: 'contributions', error: err.message }))
    },
  })
}
