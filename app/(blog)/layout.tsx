import { Providers } from 'components/Providers/Providers'
import { ContainerLayout } from 'components/layouts'
import { PropsWithChildren } from 'react'

export default function BlogLayout({ children }: PropsWithChildren<{}>) {
  return (
    <Providers>
      <ContainerLayout>{children}</ContainerLayout>
    </Providers>
  )
}
