import React from 'react'
import styles from './CheckoutRegisterStep.module.css'


interface CheckoutRegisterStepProps {
  domain: string
}

export const CheckoutRegisterStep = (props: CheckoutRegisterStepProps) => {
  // TODO: waiting form if time not passed
  return (
    <div className={styles.container}>
      <h2>Confirm registration</h2>
      <p>Commit success. Time to register {props.domain}</p>
    </div>
  )
}