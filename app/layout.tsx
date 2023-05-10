import clsx from 'clsx'
import { PropsWithChildren } from 'react'
import { Lausanne, JetBrainsMono } from 'styles/fonts'
import { Providers } from 'components/Providers/Providers'
import { ContainerLayout } from 'components/layouts'

// TODO: setup analytics
export default function Root({ children }: PropsWithChildren<{}>) {
  return (
    <html lang="en" className={clsx(Lausanne.variable, JetBrainsMono.variable)}>
      <body>
        <Providers>
          <ContainerLayout>{children}</ContainerLayout>
        </Providers>
      </body>
    </html>
  )
}
