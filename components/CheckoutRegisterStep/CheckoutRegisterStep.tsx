import { CheckoutWait } from 'components/CheckoutWait'
import { useRegistrationRead } from 'lib/hooks/storage'
import { useCountdown } from 'lib/hooks/useCountdown'
import React from 'react'
import styles from './CheckoutRegisterStep.module.css'


interface CheckoutRegisterStepProps {
  domain: string
  name: string
}

export const CheckoutRegisterStep = (props: CheckoutRegisterStepProps) => {
  // TODO: can it be undefined for some reason? 
  // do we need to handle by returning empty div?
  const reg = useRegistrationRead(props.name)
  const commitTimestamp = reg?.commitTimestamp!
  const count = useCountdown(commitTimestamp + 60 * 1000)
  const wait = count > 0

  return (
    <div className={styles.container}>
      {wait
        ? (
          <CheckoutWait value={count} />
        )
        : (<>
          <div className={styles.header}>Confirm registration</div>
          <div className={styles.subheader}>Confirm below to register your domain and configure the profile</div>
        </>)
      }
    </div>
  )
}