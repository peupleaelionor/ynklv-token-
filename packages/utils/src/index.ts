/**
 * @ynklv/utils — Small, pure, dependency-light helpers.
 */

import type { Address, TokenAmountWei } from '@ynklv/types'

const DECIMALS = 18n

// ─── Token amount formatting ─────────────────────────────────────────────────

/** Formats a wei string/bigint into a human-readable YNKLV amount. */
export function formatYnklv(
  wei: TokenAmountWei | bigint,
  opts: { decimals?: number; compact?: boolean } = {},
): string {
  const { decimals = 2, compact = false } = opts
  const value = typeof wei === 'bigint' ? wei : BigInt(wei || '0')
  const whole = value / 10n ** DECIMALS
  const frac = value % 10n ** DECIMALS

  if (compact) return compactNumber(Number(whole))

  const fracStr = frac
    .toString()
    .padStart(18, '0')
    .slice(0, decimals)
    .replace(/0+$/, '')

  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return fracStr ? `${wholeStr}.${fracStr}` : wholeStr
}

/** Parses a human YNKLV amount (e.g. "1,250.5") into a wei string. */
export function parseYnklv(amount: string): TokenAmountWei {
  const cleaned = amount.replace(/,/g, '').trim()
  const [whole = '0', frac = ''] = cleaned.split('.')
  const fracPadded = (frac + '0'.repeat(18)).slice(0, 18)
  return (BigInt(whole) * 10n ** DECIMALS + BigInt(fracPadded || '0')).toString()
}

/** 1234 -> "1.2K", 1_500_000 -> "1.5M". */
export function compactNumber(n: number): string {
  if (n < 1_000) return String(n)
  const units = [
    { v: 1e9, s: 'B' },
    { v: 1e6, s: 'M' },
    { v: 1e3, s: 'K' },
  ]
  for (const { v, s } of units) {
    if (n >= v) return `${(n / v).toFixed(1).replace(/\.0$/, '')}${s}`
  }
  return String(n)
}

// ─── Address helpers ─────────────────────────────────────────────────────────

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

export function isAddress(value: string): value is Address {
  return ADDRESS_RE.test(value)
}

/** "0x1234...abcd" */
export function truncateAddress(address: string, chars = 4): string {
  if (!isAddress(address)) return address
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`
}

export function sameAddress(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false
  return a.toLowerCase() === b.toLowerCase()
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function bps(value: bigint, basisPoints: number): bigint {
  return (value * BigInt(basisPoints)) / 10_000n
}

export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

export function shortHash(hash: string): string {
  return hash.length > 12 ? `${hash.slice(0, 8)}…${hash.slice(-4)}` : hash
}
