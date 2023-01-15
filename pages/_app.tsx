import { darkTheme, getDefaultWallets, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import '@rainbow-me/rainbowkit/styles.css'
import '../global.css'
import React from 'react'
import { AppProps } from 'next/app'

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `https://rpc.ankr.com/eth`
      })
    })
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'ENS',
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const theme: Theme = {
  ...darkTheme(),
  fonts: { body: 'var(--font)' }
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={theme} showRecentTransactions={true} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
