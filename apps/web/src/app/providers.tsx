'use client'

import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { wagmiConfig } from '../lib/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const ynklvRainbowTheme = darkTheme({
  accentColor:            '#C9A84C',   // Or Profond
  accentColorForeground:  '#080808',   // Void Black text on gold button
  borderRadius:           'medium',
  fontStack:              'system',
  overlayBlur:            'small',
})

// Override specific tokens for full YNKLV brand alignment
const customTheme = {
  ...ynklvRainbowTheme,
  colors: {
    ...ynklvRainbowTheme.colors,
    modalBackground:        '#111111',
    modalBorder:            'rgba(245, 244, 240, 0.08)',
    profileForeground:      '#161616',
    closeButton:            'rgba(245, 244, 240, 0.4)',
    closeButtonBackground:  'rgba(245, 244, 240, 0.06)',
    connectButtonBackground:'#C9A84C',
    connectButtonText:      '#080808',
    menuItemBackground:     'rgba(245, 244, 240, 0.04)',
    selectedOptionBorder:   'rgba(201, 168, 76, 0.4)',
  },
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime:            60 * 1000,     // 1 minute
          gcTime:               5 * 60 * 1000, // 5 minutes
          retry:                2,
          refetchOnWindowFocus: false,
        },
      },
    })
  )

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customTheme}
          locale="en"
          modalSize="compact"
          coolMode={false}      // No confetti — premium, not playful
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
