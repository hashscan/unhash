import React, { useLayoutEffect, useEffect, useMemo, useState } from 'react'

import { COMMIT_WAIT_MS } from 'lib/constants'
import { Registration } from 'lib/types'
import { RadialCountdown } from './RadialCountdown'

import styles from './CheckoutWaitStep.module.css'

interface CheckoutWaitStepProps {
  registration: Registration
}

export const CheckoutWaitStep = ({ registration }: CheckoutWaitStepProps) => {
  const [endOfWaitPeriodTs] = useState<number>(() => {
    const now = new Date().getTime()
    let ts = now + COMMIT_WAIT_MS // fallback

    if (
      // why do we need a fallback here? it's a small UX detail:
      // when a user lands on this screen and it's been a couple of seconds already
      // we still want to show that there's 60 secs remaining
      registration.commitTimestamp &&
      now - registration.commitTimestamp > COMMIT_WAIT_MS * 0.2
    ) {
      ts = registration.commitTimestamp + COMMIT_WAIT_MS
    }

    return ts
  })

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
