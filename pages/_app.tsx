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

import { AnalyticsScript } from 'lib/analytics'

import { Lausanne, JetBrainsMono } from 'styles/fonts'
import { currentNetwork } from 'lib/network'
import { Dialogs } from 'lib/dialogs'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const rainbowkitTheme: Theme = {
  ...darkTheme(),
  fonts: { body: 'var(--font-ui)' }
}

const metaTitle = 'Unhash: register and manage ENS names'

const metaDescription =
  'Simple tool for buying Ethereum Name Service domains. ' +
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

        {/* Disables indexing on non-primary production deployments to avoid SEO penalties */}
        {!process.env.NEXT_PUBLIC_PRODUCTION_URL && (
          <meta name="robots" content="noindex,nofollow" />
        )}

        <meta property="og:url" content={process.env.NEXT_PUBLIC_PRODUCTION_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="/og-preview.jpg" />

        {/* `summary_large_image` is an extended card preview, if this isn't set
            twitter will display it in as a regular small link preview
        */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hashscanxyz" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="/og-preview.jpg" />

        <AnalyticsScript key="analytics" />
      </Head>

      <style jsx global>
        {`
          :root {
            --font-ui: ${Lausanne.style.fontFamily};
            --font-mono: ${JetBrainsMono.style.fontFamily};
          }
        `}
      </style>

      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <NotifierProvider>
            <RegistrationsProvider>
              <RainbowKitProvider theme={rainbowkitTheme} chains={chains}>
                <WrapBalancerProvider>
                  {wrapInLayout(Component, <Component {...pageProps} />)}
                  <Feedback />
                  <Dialogs />
                </WrapBalancerProvider>
              </RainbowKitProvider>
            </RegistrationsProvider>
          </NotifierProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  )
}

export default App
