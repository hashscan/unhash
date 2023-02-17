import { darkTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { createClient, WagmiConfig } from 'wagmi'
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer'
import { NotifierProvider } from 'components/ui/Notifier/NotifierProvider'

import { AppProps } from 'next/app'
import Head from 'next/head'

import 'styles/global.css'
import '@rainbow-me/rainbowkit/styles.css'
import { chains, provider, connectors } from 'lib/connectors'
import { wrapInLayout } from 'components/layouts'

import { Lausanne, JetBrainsMono } from 'styles/fonts'

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const rainbowkitTheme: Theme = {
  ...darkTheme(),
  fonts: { body: 'var(--font-ui)' }
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Get .ETH Domain For Your Ethereum Address</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        <meta
          name="description"
          key="meta-description"
          content={
            'Simple tool for buying Etherium Name Service domains. ' +
            'Set up your public .eth profile to stand out in Metaverse ' +
            '(zero crypto knowledge required!)'
          }
        />
      </Head>

      <style jsx global>
        {`
          :root {
            --font-ui: ${Lausanne.style.fontFamily};
            --font-mono: ${JetBrainsMono.style.fontFamily};
          }
        `}
      </style>

      <WagmiConfig client={wagmiClient}>
        <NotifierProvider>
          <RainbowKitProvider theme={rainbowkitTheme} chains={chains}>
            <WrapBalancerProvider>
              {wrapInLayout(Component, <Component {...pageProps} />)}
            </WrapBalancerProvider>
          </RainbowKitProvider>
        </NotifierProvider>
      </WagmiConfig>
    </>
  )
}

export default App
