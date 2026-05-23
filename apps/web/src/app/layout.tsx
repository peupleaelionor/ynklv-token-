import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import '../styles/globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets:  ['latin', 'latin-ext'],
  variable: '--font-inter',
  display:  'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — YNKLV',
    default:  'YNKLV — Build the Civilization',
  },
  description:
    'YNKLV is the financial and cultural infrastructure for Afro-global creators, builders, and communities. Not a coin. A civilization.',
  keywords:   ['YNKLV', 'Afro-futurist', 'creator economy', 'Web3', 'Africa', 'digital identity'],
  authors:    [{ name: 'YNKLV Foundation' }],
  creator:    'YNKLV Foundation',
  metadataBase: new URL('https://ynklv.xyz'),
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://ynklv.xyz',
    siteName:    'YNKLV',
    title:       'YNKLV — Build the Civilization',
    description: 'The Afro-global digital asset ecosystem.',
    images: [{
      url:    '/og.png',
      width:  1200,
      height: 630,
      alt:    'YNKLV — Build the Civilization',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'YNKLV — Build the Civilization',
    description: 'The Afro-global digital asset ecosystem.',
    images:      ['/og.png'],
    creator:     '@ynklv',
  },
  icons: {
    icon:  [
      { url: '/favicon-16.png', sizes: '16x16',  type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32',  type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/manifest.json',  // PWA manifest
}

export const viewport: Viewport = {
  themeColor:         '#080808',
  colorScheme:        'dark',
  width:              'device-width',
  initialScale:       1,
  maximumScale:       1,
  userScalable:       false,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        {/* Preconnect to key domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-void text-blanc antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
