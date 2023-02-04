import { Domain } from 'lib/types'
import React from 'react'
import styles from './CheckoutCommitStep.module.css'
import ui from 'styles/ui.module.css'
import { EthereumIcon } from 'components/icons'
import clsx from 'clsx'


interface CheckoutCommitStepProps {
  domain: Domain
}

export const CheckoutCommitStep = (props: CheckoutCommitStepProps) => {

  return (
    <div className={styles.container}>
      <div className={styles.header}>Registration period</div>
      <div className={styles.subheader}>Buy more years now to save on fees</div>
      <div className={styles.duration}>
        <div className={clsx(styles.durationButton, styles.durationButtonSelected)}>1 year</div>
        <div className={styles.durationButton}>2 years</div>
        <div className={styles.durationButton}>3 years</div>
        <div className={styles.durationButton}>4 years</div>
      </div>

      <div className={styles.header}>Domain Ownership</div>
      <div className={styles.subheader}>Optionally buy this domain on another wallet</div>

      <div className={styles.inputContainer}>
        <div className={styles.inputIcon}><EthereumIcon /></div>
        <input name="owner" placeholder="0x01234...F0A0 (Optional)" autoComplete="off" className={`${styles.owner} ${ui.input}`} />
      </div>

      <div className={styles.header}>ENS Profile</div>
      <div className={styles.subheader}>Configure public ENS profile for this domain if you are setting it for your wallet. You can skip it or complete after registration</div>
      <input name="name" placeholder="Add a display name" autoComplete="off" className={clsx(styles.profileInput, ui.input)} />
      <input name="description" placeholder="Add a bio to your profile" autoComplete="off" className={clsx(styles.profileInput, ui.input)} />
      <input name="url" placeholder="Add your website" autoComplete="off" className={clsx(styles.profileInput, ui.input)} />
      <input name="email" placeholder="Personal email" autoComplete="off" className={clsx(styles.profileInput, ui.input)} />
      <input name="twitter" placeholder="@username" autoComplete="off" className={clsx(styles.profileInput, ui.input, styles.profileInputLast)} />
    </div>
  )
}
