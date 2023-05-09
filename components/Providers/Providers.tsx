'use client'

import { darkTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { createClient, WagmiConfig } from 'wagmi'
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer'

import { RegistrationsProvider } from 'components/RegistrationsProvider/RegistrationsProvider'
import { NotifierProvider } from 'components/ui/Notifier/NotifierProvider'
// import { Feedback } from 'components/Feedback/Feedback'

import 'styles/global.css'
import '@rainbow-me/rainbowkit/styles.css'
import { chains, provider, connectors } from 'lib/connectors'

import { Dialogs } from 'lib/dialogs'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

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

export const Providers = ({ children }: PropsWithChildren<{}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <NotifierProvider>
          <RegistrationsProvider>
            <RainbowKitProvider theme={rainbowkitTheme} chains={chains}>
              <WrapBalancerProvider>
                {children}
                {/* <Feedback /> */}
                <Dialogs />
              </WrapBalancerProvider>
            </RainbowKitProvider>
          </RegistrationsProvider>
        </NotifierProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}
