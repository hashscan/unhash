import React from 'react'
import styles from './CheckoutRegisterStep.module.css'
import { ProgressBar } from 'components/icons'


interface CheckoutRegisterStepProps {
  domain: string
}

export const CheckoutRegisterStep = (props: CheckoutRegisterStepProps) => {
  return (
    <div className={styles.container}>
      <p>Commit success. Time to register {props.domain}</p>
      <ProgressBar color="var(--text-primary)" />
    </div>
  )
}