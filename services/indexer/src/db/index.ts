// Minimal DB adapter — swap for pg/postgres.js in production.
// In MOCK=1 mode everything runs in-memory and calls are no-ops.

export interface EventRow {
  txHash: string
  logIndex: number
  blockNumber: bigint
  blockTime: Date
  [key: string]: unknown
}

class MockDb {
  private seen = new Set<string>()
  private rows: EventRow[] = []

  isDuplicate(txHash: string, logIndex: number): boolean {
    return this.seen.has(`${txHash}:${logIndex}`)
  }

  insert(table: string, row: EventRow): void {
    const key = `${row.txHash}:${row.logIndex}`
    if (this.seen.has(key)) return
    this.seen.add(key)
    this.rows.push({ ...row, _table: table })
    console.log(JSON.stringify({ ts: new Date().toISOString(), db: 'mock-insert', table, txHash: row.txHash }))
  }

  getLastBlock(): bigint {
    return 0n
  }

  setLastBlock(_block: bigint): void {
    // no-op in mock
  }

  all(): EventRow[] {
    return [...this.rows]
  }
}

export const db = new MockDb()
