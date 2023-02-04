import { CheckoutWait } from 'components/CheckoutWait'
import { useCountdown } from 'lib/hooks/useCountdown'
import React, { useState } from 'react'
import styles from './CheckoutRegisterStep.module.css'


const WAIT_TIME_S = 5

interface CheckoutRegisterStepProps {
  domain: string
}

export const CheckoutRegisterStep = (props: CheckoutRegisterStepProps) => {
  // emulate recent commit tx timestamp
  const [commitedAt,] = useState(Date.now())

  const count = useCountdown(commitedAt + WAIT_TIME_S * 1000)
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