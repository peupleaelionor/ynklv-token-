import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YNKLV Dashboard',
  description: 'Zamani ecosystem dashboard — access, participation, and coordination.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ynklv-black text-ynklv-cream antialiased">{children}</body>
    </html>
  )
}
