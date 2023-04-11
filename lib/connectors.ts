import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { configureChains } from 'wagmi'
import { currentNetwork, toChain } from './network'

const { chains, provider } = configureChains(
  [toChain(currentNetwork())],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!, priority: 0 })
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
      zerionWallet({ chains }),
      walletConnectWallet({ chains })
    ]
  }
])

export { provider, connectors, chains }
