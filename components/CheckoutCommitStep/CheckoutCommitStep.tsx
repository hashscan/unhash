import { Domain } from 'lib/types'
import React from 'react'
import styles from './CheckoutCommitStep.module.css'
import ui from 'styles/ui.module.css'


interface CheckoutCommitStepProps {
  domain: Domain
}

export const CheckoutCommitStep = (props: CheckoutCommitStepProps) => {

  return (
    <div className={styles.container}>
      <div className={styles.header}>Registration period</div>
      <div className={styles.subheader}>Buy more years now to save on fees</div>
      <div className={styles.duration}>
        <div className={`${styles.durationButton} ${styles.durationButtonSelected}`}>1 year</div>
        <div className={styles.durationButton}>2 years</div>
        <div className={styles.durationButton}>3 years</div>
        <div className={styles.durationButton}>4 years</div>
      </div>

      <div className={styles.header}>Domain Ownership</div>
      <div className={styles.subheader}>Enter address if you want to buy a domain for another wallet</div>
      <input name="name" placeholder="0x01234...F0A0 (Optional)" autocomplete="off" className={`${styles.owner} ${ui.input}`} />

      <div className={styles.header}>Profile</div>
      <div className={styles.subheader}>Configure ENS profile for this domain. You can complete it after registration</div>
      <div className={styles.contentPlaceholder}>
        <div style={{ fontWeight: '400', padding: '15px' }}>
          Commit step
        </div>
      </div>
    </div>
  )
}
