import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  zerionWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
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
      zerionWallet({ chains }),
      rainbowWallet({ chains }),
      trustWallet({ chains }),
      walletConnectWallet({ chains })
    ]
  }
])

export { provider, connectors, chains }
