'use client'

import { shortenAddress } from '@/lib/format'

interface HeaderProps {
  address?: string
  title: string
}

export function Header({ address, title }: HeaderProps) {
  return (
    <header className="h-14 border-b border-ynklv flex items-center justify-between px-8 bg-ynklv-black/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-sm font-medium tracking-wider text-ynklv-cream/70 uppercase">{title}</h1>
      <div className="flex items-center gap-4">
        {address ? (
          <span className="text-xs text-ynklv-muted font-mono">{shortenAddress(address)}</span>
        ) : (
          <span className="text-xs text-ynklv-muted">Not connected</span>
        )}
        <button className="text-xs border border-ynklv rounded-lg px-3 py-1.5 text-ynklv-muted hover:text-ynklv-cream hover:border-copper transition-colors">
          Connect
        </button>
      </div>
    </header>
  )
}
