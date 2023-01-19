import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, goerli } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { configureChains } from 'wagmi'

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!, priority: 0 }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.id === 1 ? 'https://rpc.ankr.com/eth' : `https://rpc.ankr.com/eth_goerli`
      }),
      priority: 1
    })
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
