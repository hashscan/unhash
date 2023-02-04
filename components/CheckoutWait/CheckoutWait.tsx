import React from 'react'
import styles from './CheckoutWait.module.css'
import { ProgressBar } from 'components/icons'


interface CheckoutWaitProps {
  value: number
}

export const CheckoutWait = (props: CheckoutWaitProps) => {
  return (
    <div className={styles.container}>
      <p>Wait {props.value} seconds</p>
      <ProgressBar color="var(--text-primary)" />
    </div>
  )
}
