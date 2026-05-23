import { http, createConfig } from 'wagmi'
import { base, baseSepolia, mainnet } from 'wagmi/chains'
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ''

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors: [
    coinbaseWallet({
      appName: 'YNKLV',
      appLogoUrl: 'https://ynklv.xyz/logo.png',
      // Prefer Base chain
      preference: 'smartWalletOnly',
    }),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]:        http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
    [mainnet.id]:     http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
