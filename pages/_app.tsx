import { darkTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { createClient, WagmiConfig } from 'wagmi'

import '@rainbow-me/rainbowkit/styles.css'
import 'styles/global.css'
import localFont from '@next/font/local'
import { AppProps } from 'next/app'
import { chains, provider, connectors } from 'lib/connectors'
import { wrapInLayout } from 'components/layouts'

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const rainbowkitTheme: Theme = {
  ...darkTheme(),
  fonts: { body: 'var(--font-ui)' }
}

// primary Sans Serif font for the UI
const Lausanne = localFont({
  src: [
    {
      path: '../styles/fonts/Lausanne/Lausanne-200.woff2',
      weight: '200'
    },
    {
      path: '../styles/fonts/Lausanne/Lausanne-300.woff2',
      weight: '300'
    },
    {
      path: '../styles/fonts/Lausanne/Lausanne-400.woff2',
      weight: '400'
    },
    {
      path: '../styles/fonts/Lausanne/Lausanne-500.woff2',
      weight: '500'
    },
    {
      path: '../styles/fonts/Lausanne/Lausanne-600.woff2',
      weight: '600'
    }
  ],
  fallback: ['system-ui'],
  display: 'swap'
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-ui: ${Lausanne.style.fontFamily};
          }
        `}
      </style>

      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider theme={rainbowkitTheme} chains={chains}>
          {wrapInLayout(Component, <Component {...pageProps} />)}
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}

export default App
