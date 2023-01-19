import { darkTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { createClient, WagmiConfig } from 'wagmi'

import '@rainbow-me/rainbowkit/styles.css'
import '../global.css'
import React from 'react'
import { AppProps } from 'next/app'
import { chains, provider, connectors } from 'lib/connectors'

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
      <RainbowKitProvider theme={theme} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
