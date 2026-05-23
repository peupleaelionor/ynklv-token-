import { runEpochSettlement } from './jobs/epoch-settlement.js'
import { runTreasurySnapshot } from './jobs/treasury-snapshot.js'
import { runContributionRollup } from './jobs/contribution-rollup.js'

interface Job {
  name: string
  intervalMs: number
  run: () => Promise<unknown>
  lastRan: number
}

// Interval-based scheduler — swap individual jobs for BullMQ queues in production.
const jobs: Job[] = [
  { name: 'epoch-settlement', intervalMs: 24 * 60 * 60 * 1000, run: runEpochSettlement, lastRan: 0 },
  { name: 'treasury-snapshot', intervalMs: 60 * 60 * 1000, run: runTreasurySnapshot, lastRan: 0 },
  { name: 'contribution-rollup', intervalMs: 6 * 60 * 60 * 1000, run: runContributionRollup, lastRan: 0 },
]

async function tick() {
  const now = Date.now()
  for (const job of jobs) {
    if (now - job.lastRan >= job.intervalMs) {
      job.lastRan = now
      try {
        await job.run()
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        console.error(JSON.stringify({ ts: new Date().toISOString(), job: job.name, error }))
      }
    }
  }
}

async function main() {
  console.log(JSON.stringify({ ts: new Date().toISOString(), msg: 'YANKELV Worker starting', jobs: jobs.map((j) => j.name) }))

  // Run all jobs immediately on boot, then on schedule.
  await tick()

  const handle = setInterval(() => {
    tick().catch((err) => {
      console.error(JSON.stringify({ ts: new Date().toISOString(), scheduler: 'tick-error', error: String(err) }))
    })
  }, 60_000)

  const shutdown = () => {
    clearInterval(handle)
    console.log(JSON.stringify({ ts: new Date().toISOString(), msg: 'Worker shutdown complete' }))
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main().catch((err) => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), error: String(err) }))
  process.exit(1)
})
