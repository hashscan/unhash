import { useEffect } from 'react'
import { useRegistration } from 'lib/hooks/useRegistration'

import { openDialog } from 'lib/dialogs'

type UnfinishedRegistrationProps = {}

export const UnfinishedRegistration = ({}: UnfinishedRegistrationProps) => {
  const { registration } = useRegistration()

  useEffect(() => {
    if (registration && registration.status !== 'registered') {
      openDialog('unfinishedRegistration')
    }
  }, [registration])

  return null
}
