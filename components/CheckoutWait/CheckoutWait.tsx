import React from 'react'
import styles from './CheckoutWait.module.css'
import { ProgressBar } from 'components/icons'
import { useCountdown } from 'lib/hooks/useCountdown'
import { COMMIT_WAIT_MS } from 'lib/constants'

interface CheckoutWaitProps {
  commitTimestamp: number
}

export const CheckoutWait = (props: CheckoutWaitProps) => {
  const count = useCountdown(props.commitTimestamp + COMMIT_WAIT_MS)
  return (
    <div className={styles.container}>
      <p>Wait {count} seconds</p>
      <ProgressBar color="var(--text-primary)" />
    </div>
  )
}
