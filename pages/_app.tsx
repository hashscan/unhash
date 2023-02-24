import { darkTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { createClient, WagmiConfig } from 'wagmi'
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer'
import { AppProps } from 'next/app'
import Head from 'next/head'

import { wrapInLayout } from 'components/layouts'
import { RegistrationsProvider } from 'components/RegistrationsProvider/RegistrationsProvider'
import { NotifierProvider } from 'components/ui/Notifier/NotifierProvider'
import { Feedback } from 'components/Feedback/Feedback'

import 'styles/global.css'
import '@rainbow-me/rainbowkit/styles.css'
import { chains, provider, connectors } from 'lib/connectors'
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

/* TODO: adjust these before the release! */
const publicURL = 'https://xens.vercel.app'

const metaTitle = 'Get .ETH Domain For Your Ethereum Address'

const metaDescription =
  'Simple tool for buying Etherium Name Service domains. ' +
  'Set up your public .eth profile to stand out in Metaverse ' +
  '(zero crypto knowledge required!)'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>{metaTitle}</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" key="favicon" type="image/svg+xml" href="/favicon.svg" />

        <meta name="description" key="meta-description" content={metaDescription} />

        <meta property="og:url" content={publicURL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="/og-preview.png" />

        {/* `summary_large_image` is an extended card preview, if this isn't set
            twitter will display it in as a regular small link preview
        */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hashscanxyz" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="/og-preview.png" />
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
          <RegistrationsProvider>
            <RainbowKitProvider theme={rainbowkitTheme} chains={chains}>
              <WrapBalancerProvider>
                {wrapInLayout(Component, <Component {...pageProps} />)}
                <Feedback />
              </WrapBalancerProvider>
            </RainbowKitProvider>
          </RegistrationsProvider>
        </NotifierProvider>
      </WagmiConfig>
    </>
  )
}

export default App
