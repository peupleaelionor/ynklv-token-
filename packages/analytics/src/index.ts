/**
 * @ynklv/analytics — minimal, privacy-respecting event tracking.
 *
 * Principles:
 *  - No PII. Wallet addresses are hashed before they leave the device.
 *  - No third-party ad/tracking pixels.
 *  - Events describe ecosystem participation, not surveillance.
 *  - Honors Do-Not-Track and an explicit opt-out.
 */

export type AnalyticsEvent =
  | 'page.view'
  | 'wallet.connect'
  | 'membership.view'
  | 'gate.granted'
  | 'gate.denied'
  | 'checkout.created'
  | 'reward.claimed'
  | 'governance.viewed'
  | 'referral.followed'

export interface AnalyticsPayload {
  event: AnalyticsEvent
  /** Non-identifying properties only. */
  props?: Record<string, string | number | boolean>
  /** Hashed address (never raw). Set via {@link hashAddress}. */
  actorHash?: string
  ts?: number
}

export interface AnalyticsTransport {
  send(payload: AnalyticsPayload): void | Promise<void>
}

export interface AnalyticsOptions {
  transport: AnalyticsTransport
  enabled?: boolean
  respectDoNotTrack?: boolean
}

/** Stable, non-reversible short hash of an address for cohort analysis. */
export function hashAddress(address: string): string {
  let h = 2166136261
  const lower = address.toLowerCase()
  for (let i = 0; i < lower.length; i++) {
    h ^= lower.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

function doNotTrackEnabled(): boolean {
  if (typeof navigator === 'undefined') return false
  const dnt =
    (navigator as Navigator & { doNotTrack?: string }).doNotTrack ??
    (globalThis as { doNotTrack?: string }).doNotTrack
  return dnt === '1' || dnt === 'yes'
}

export class Analytics {
  private readonly transport: AnalyticsTransport
  private enabled: boolean
  private readonly respectDnt: boolean

  constructor(opts: AnalyticsOptions) {
    this.transport = opts.transport
    this.enabled = opts.enabled ?? true
    this.respectDnt = opts.respectDoNotTrack ?? true
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  track(
    event: AnalyticsEvent,
    props?: Record<string, string | number | boolean>,
    actorAddress?: string,
  ): void {
    if (!this.enabled) return
    if (this.respectDnt && doNotTrackEnabled()) return

    const payload: AnalyticsPayload = {
      event,
      props,
      actorHash: actorAddress ? hashAddress(actorAddress) : undefined,
      ts: Date.now(),
    }
    void this.transport.send(payload)
  }
}

/** A transport that POSTs events to the YNKLV API (or any collector). */
export function httpTransport(url: string, fetchImpl: typeof fetch = fetch): AnalyticsTransport {
  return {
    send(payload) {
      void fetchImpl(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        /* analytics must never break the app */
      })
    },
  }
}

/** A no-op transport for tests / opt-out. */
export const nullTransport: AnalyticsTransport = { send() {} }
