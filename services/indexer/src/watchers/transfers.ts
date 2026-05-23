import { PublicClient, parseAbiItem } from 'viem'
import { db } from '../db/index.js'

const transferEvent = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)')

export async function watchTransfers(client: PublicClient, tokenAddress: `0x${string}`) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), watcher: 'transfers', contract: tokenAddress }))

  return client.watchEvent({
    address: tokenAddress,
    event: transferEvent,
    onLogs: (logs) => {
      for (const log of logs) {
        if (db.isDuplicate(log.transactionHash ?? '', log.logIndex ?? 0)) continue

        db.insert('transfers', {
          txHash: log.transactionHash ?? '',
          logIndex: log.logIndex ?? 0,
          blockNumber: log.blockNumber ?? 0n,
          blockTime: new Date(),
          fromAddress: (log.args.from ?? '').toLowerCase(),
          toAddress: (log.args.to ?? '').toLowerCase(),
          amountWei: log.args.value?.toString() ?? '0',
        })
      }
    },
    onError: (err) => {
      console.error(JSON.stringify({ ts: new Date().toISOString(), watcher: 'transfers', error: err.message }))
    },
  })
}
