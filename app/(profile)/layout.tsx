import { PropsWithChildren } from 'react'
import { Feedback } from 'components/Feedback/Feedback'
import { AppRouterLayout } from 'components/layouts'

export default function ProfileLayout({ children }: PropsWithChildren<{}>) {
  return (
    <AppRouterLayout verticalPadding={false}>
      {children}
      <Feedback />
    </AppRouterLayout>
  )
}
