import { PublicClient, parseAbiItem } from 'viem'
import { db } from '../db/index.js'

const allocatedEvent = parseAbiItem(
  'event Allocated(address indexed member, uint256 amount, bytes32 epochId, string reason)',
)
const claimedEvent = parseAbiItem('event Claimed(address indexed member, uint256 amount)')

export async function watchRewards(client: PublicClient, vaultAddress: `0x${string}`) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), watcher: 'rewards', contract: vaultAddress }))

  const unsubAllocated = client.watchEvent({
    address: vaultAddress,
    event: allocatedEvent,
    onLogs: (logs) => {
      for (const log of logs) {
        if (db.isDuplicate(log.transactionHash ?? '', log.logIndex ?? 0)) continue
        db.insert('reward_events', {
          txHash: log.transactionHash ?? '',
          logIndex: log.logIndex ?? 0,
          blockNumber: log.blockNumber ?? 0n,
          blockTime: new Date(),
          eventType: 'allocated',
          memberAddress: (log.args.member ?? '').toLowerCase(),
          epochId: log.args.epochId ?? '',
          amountWei: log.args.amount?.toString() ?? '0',
          reason: log.args.reason ?? '',
        })
      }
    },
    onError: (err) => {
      console.error(JSON.stringify({ ts: new Date().toISOString(), watcher: 'rewards:allocated', error: err.message }))
    },
  })

  const unsubClaimed = client.watchEvent({
    address: vaultAddress,
    event: claimedEvent,
    onLogs: (logs) => {
      for (const log of logs) {
        if (db.isDuplicate(log.transactionHash ?? '', log.logIndex ?? 0)) continue
        db.insert('reward_events', {
          txHash: log.transactionHash ?? '',
          logIndex: log.logIndex ?? 0,
          blockNumber: log.blockNumber ?? 0n,
          blockTime: new Date(),
          eventType: 'claimed',
          memberAddress: (log.args.member ?? '').toLowerCase(),
          amountWei: log.args.amount?.toString() ?? '0',
        })
      }
    },
    onError: (err) => {
      console.error(JSON.stringify({ ts: new Date().toISOString(), watcher: 'rewards:claimed', error: err.message }))
    },
  })

  return () => {
    unsubAllocated()
    unsubClaimed()
  }
}
