'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const USER_NAV = [
  { href: '/user', label: 'Overview', icon: '◈' },
  { href: '/user/rewards', label: 'Rewards', icon: '◎' },
  { href: '/user/identity', label: 'Identity', icon: '◉' },
  { href: '/user/access', label: 'Access', icon: '◇' },
  { href: '/user/activity', label: 'Activity', icon: '◌' },
]

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', icon: '▣' },
  { href: '/admin/treasury', label: 'Treasury', icon: '▢' },
  { href: '/admin/contracts', label: 'Contracts', icon: '▤' },
  { href: '/admin/roles', label: 'Roles', icon: '▥' },
  { href: '/admin/compliance', label: 'Compliance', icon: '▦' },
]

interface SidebarProps {
  variant: 'user' | 'admin'
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname()
  const nav = variant === 'admin' ? ADMIN_NAV : USER_NAV

  return (
    <aside className="w-56 shrink-0 border-r border-ynklv bg-ynklv-surface flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-ynklv">
        <span className="text-ynklv-cream font-light tracking-[0.2em] text-lg">YNKLV</span>
        {variant === 'admin' && (
          <span className="block text-[10px] uppercase tracking-widest text-ynklv-copper mt-0.5">Admin</span>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== '/user' && item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#1A1209] text-ynklv-copper'
                  : 'text-ynklv-muted hover:text-ynklv-cream hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-ynklv space-y-0.5">
        {variant === 'user' ? (
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-ynklv-muted hover:text-ynklv-cream">
            <span>▣</span> Admin view
          </Link>
        ) : (
          <Link href="/user" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-ynklv-muted hover:text-ynklv-cream">
            <span>◈</span> User view
          </Link>
        )}
      </div>
    </aside>
  )
}
