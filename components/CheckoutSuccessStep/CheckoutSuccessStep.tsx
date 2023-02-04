import React from 'react'
import styles from './CheckoutSuccessStep.module.css'


interface CheckoutSuccessStepProps {
  domain: string
}

export const CheckoutSuccessStep = (props: CheckoutSuccessStepProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>Success!</div>
      <div className={styles.subheader}>Now you own your {props.domain} and it is set to your wallet.</div>
    </div>
  )
}