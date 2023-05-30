import { Feedback } from 'components/Feedback/Feedback'
import { AppRouterLayout } from 'components/layouts'
import { PropsWithChildren } from 'react'

export default function BlogLayout({ children }: PropsWithChildren<{}>) {
  return (
    <AppRouterLayout>
      {children}
      <Feedback />
    </AppRouterLayout>
  )
}
