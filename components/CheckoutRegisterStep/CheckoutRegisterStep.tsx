import React from 'react'
import styles from './CheckoutRegisterStep.module.css'


interface CheckoutRegisterStepProps {
  domain: string
}

export const CheckoutRegisterStep = (props: CheckoutRegisterStepProps) => {
  // TODO: add waiting form if time not passed
  return (
    <div className={styles.container}>
      <div className={styles.header}>Confirm registration</div>
      <div className={styles.subheader}>Confirm below to register your domain and configure the profile</div>
    </div>
  )
}