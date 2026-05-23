import { PublicClient, parseAbiItem } from 'viem'
import { db } from '../db/index.js'

const purchaseEvent = parseAbiItem(
  'event Purchase(address indexed creator, address indexed buyer, uint256 indexed productId, uint256 amount, uint256 creatorShare, uint256 treasuryShare, uint256 burnedAmount)',
)

export async function watchSales(client: PublicClient, distributorAddress: `0x${string}`) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), watcher: 'sales', contract: distributorAddress }))

  return client.watchEvent({
    address: distributorAddress,
    event: purchaseEvent,
    onLogs: (logs) => {
      for (const log of logs) {
        if (db.isDuplicate(log.transactionHash ?? '', log.logIndex ?? 0)) continue
        db.insert('creator_sales', {
          txHash: log.transactionHash ?? '',
          logIndex: log.logIndex ?? 0,
          blockNumber: log.blockNumber ?? 0n,
          blockTime: new Date(),
          creator: (log.args.creator ?? '').toLowerCase(),
          buyer: (log.args.buyer ?? '').toLowerCase(),
          productId: log.args.productId?.toString() ?? '0',
          amountWei: log.args.amount?.toString() ?? '0',
          creatorShare: log.args.creatorShare?.toString() ?? '0',
          treasuryShare: log.args.treasuryShare?.toString() ?? '0',
          burnedAmount: log.args.burnedAmount?.toString() ?? '0',
        })
      }
    },
    onError: (err) => {
      console.error(JSON.stringify({ ts: new Date().toISOString(), watcher: 'sales', error: err.message }))
    },
  })
}
