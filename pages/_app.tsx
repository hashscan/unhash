import { darkTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { createClient, WagmiConfig } from 'wagmi'
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer'
import { NotifierProvider } from 'components/ui/Notifier/NotifierProvider'

import '@rainbow-me/rainbowkit/styles.css'
import 'styles/global.css'
import { AppProps } from 'next/app'
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
