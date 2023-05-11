import { AppProps } from 'next/app'
import Head from 'next/head'

import { Providers } from 'components/Providers/Providers'
import { wrapInLayout } from 'components/layouts'
import { Feedback } from 'components/Feedback/Feedback'
import { useCurrentRoute } from 'lib/hooks/useCurrentRoute'

import 'styles/global.css'
import '@rainbow-me/rainbowkit/styles.css'

import { AnalyticsScript } from 'lib/analytics'

import { Lausanne, JetBrainsMono } from 'styles/fonts'

const metaTitle = 'Unhash: register and manage ENS names'

const metaDescription =
  'Buy, register and manage Ethereum Name Service domains. ' +
  'Set NFT as ENS avatar, set ENS as primary domain, bulk search ' +
  'and register multiple ENS names.'

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

      <Providers>
        {wrapInLayout(Component, <Component {...pageProps} />)}
        <Feedback usePathname={useCurrentRoute} />
      </Providers>
    </>
  )
}

export default App
