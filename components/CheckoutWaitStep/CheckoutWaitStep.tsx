import React, { useMemo } from 'react'

import { COMMIT_WAIT_MS } from 'lib/constants'
import { Registration } from 'lib/types'
import { RadialCountdown } from './RadialCountdown'

import styles from './CheckoutWaitStep.module.css'

interface CheckoutWaitStepProps {
  registration: Registration
}

export const CheckoutWaitStep = ({ registration }: CheckoutWaitStepProps) => {
  const endOfWaitPeriodTs = useMemo(() => {
    const ts = registration.commitTimestamp || new Date().getTime()
    return ts + COMMIT_WAIT_MS
  }, [registration.commitTimestamp])

  return (
    <div className={styles.container}>
      <RadialCountdown className={styles.countdown} timestamp={endOfWaitPeriodTs} />
      <h1 className={styles.title}>Just a Minute, Please</h1>

      <p className={styles.description}>
        Your domain name has been reserved! Please wait <b>60&nbsp;seconds</b> before completing the
        registration.
      </p>

      <p className={styles.note}>
        This is an ENS protocol requirement, to ensure that no one else can obtain the domain before
        you.
      </p>
    </div>
  )
}
