import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { configureChains } from 'wagmi'
import { currentNetwork, toChain } from './network'

const { chains, provider } = configureChains(
  [toChain(currentNetwork())],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!, priority: 0 }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY! })
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
