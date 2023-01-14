import { darkTheme, getDefaultWallets, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import '@rainbow-me/rainbowkit/styles.css'
import '../global.css'
import React from 'react'
import { AppProps } from 'next/app'

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! })]
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
