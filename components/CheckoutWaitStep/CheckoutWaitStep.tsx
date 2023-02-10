import React from 'react'
import styles from './CheckoutWaitStep.module.css'
import { ProgressBar } from 'components/icons'
import { useCountdown } from 'lib/hooks/useCountdown'
import { COMMIT_WAIT_MS } from 'lib/constants'

interface CheckoutWaitStepProps {
  commitTimestamp: number
}

export const CheckoutWaitStep = (props: CheckoutWaitStepProps) => {
  const count = useCountdown(props.commitTimestamp + COMMIT_WAIT_MS)
  return (
    <div className={styles.container}>
      <p>Wait {count} seconds</p>
      <ProgressBar color="var(--color-text-primary)" />
    </div>
  )
}
