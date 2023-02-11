import clsx from 'clsx'
import { CheckoutStep } from 'pages/[domain]/register'
import React from 'react'
import styles from './CheckoutProgress.module.css'

interface CheckoutProgressProps {
  step: CheckoutStep
  className?: string
}

export const CheckoutProgress = (props: CheckoutProgressProps) => {
  return (
    <div className={props.className}>
      <span className={clsx(styles.step, { [styles.currentStep]: props.step === 'commit' })}>
        Start
      </span>{' '}
      {'>'}{' '}
      <span className={clsx(styles.step, { [styles.currentStep]: props.step === 'wait' })}>
        Wait
      </span>{' '}
      {'>'}{' '}
      <span className={clsx(styles.step, { [styles.currentStep]: props.step === 'register' })}>
        Register
      </span>{' '}
      {'>'}{' '}
      <span className={clsx(styles.step, { [styles.currentStep]: props.step === 'success' })}>
        Success
      </span>
    </div>
  )
}
