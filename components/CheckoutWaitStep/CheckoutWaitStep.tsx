import React from 'react'
import { motion } from 'framer-motion'
import { useCountdown } from 'lib/hooks/useCountdown'
import { COMMIT_WAIT_MS } from 'lib/constants'

import { SlideFlap } from 'components/ui/SlideFlap/SlideFlap'
import styles from './CheckoutWaitStep.module.css'

interface CheckoutWaitStepProps {
  commitTimestamp: number
}

export const CheckoutWaitStep = (props: CheckoutWaitStepProps) => {
  const count = useCountdown(props.commitTimestamp + COMMIT_WAIT_MS)

  // always show no more than two digits
  // even if for some reason the wait time is longer
  const seconds60 = Math.max(Math.min(60, count), 0)

  const pathLength = 1.0 - seconds60 / 60.0

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <div className={styles.seconds}>
          <SlideFlap flipKey={String(seconds60)} slotClassName={styles.second}>
            {seconds60}
          </SlideFlap>
        </div>

        <svg viewBox="0 0 128 128">
          <circle
            stroke="var(--color-slate-6)"
            cx={64}
            cy={64}
            r={54}
            fill="none"
            strokeWidth={6}
          />

          <motion.circle
            stroke="var(--color-slate-1)"
            cx={64}
            cy={64}
            r={54}
            fill="none"
            strokeWidth={6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength }}
          />
        </svg>
      </div>

      <h1 className={styles.title}>Almost there...</h1>

      <p className={styles.description}>
        Your domain name has been reserved! Now, please hold on for <b>one minute</b> before you can
        finish the registration.
      </p>

      <p className={styles.note}>
        This is an ENS protocol requirement, to ensure that no one else can obtain the domain before
        you.
      </p>
    </div>
  )
}
