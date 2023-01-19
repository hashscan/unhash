import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { configureChains } from 'wagmi'
import { NETWORKS } from './constants'
import { toChain } from './types'

const { chains, provider } = configureChains(
  NETWORKS.map(n => toChain(n)),
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!, priority: 0 }),
    // no backup provider on purpose
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ chains, shimDisconnect: true }),
      argentWallet({ chains }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains })
    ]
  }
])

export { provider, connectors, chains }