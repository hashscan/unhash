import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  zerionWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { configureChains } from 'wagmi'
import { currentNetwork, toChain } from './network'

const { chains, provider } = configureChains(
  [toChain(currentNetwork())],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!, priority: 0 }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
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
