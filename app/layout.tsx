import clsx from 'clsx'
import { PropsWithChildren } from 'react'
import { Lausanne, JetBrainsMono } from 'styles/fonts'
import { Providers } from 'components/Providers/Providers'
import { Feedback } from 'components/Feedback/Feedback'
import { AppRouterLayout } from 'components/layouts'

// TODO: setup analytics
export default function Root({ children }: PropsWithChildren<{}>) {
  return (
    <html lang="en" className={clsx(Lausanne.variable, JetBrainsMono.variable)}>
      <body>
        <Providers>
          <AppRouterLayout>
            {children}
            <Feedback />
          </AppRouterLayout>
        </Providers>
      </body>
    </html>
  )
}
