import { Domain } from 'lib/types'
import React from 'react'
import styles from './CheckoutCommitStep.module.css'
import ui from 'styles/ui.module.css'
import { EthereumIcon } from 'components/icons'
import clsx from 'clsx'
import { formatYears } from 'lib/format'


interface CheckoutCommitStepProps {
  domain: Domain
  durationYears: number
  onDurationChanged?: (year: number) => void
}

export const CheckoutCommitStep = (props: CheckoutCommitStepProps) => {
  const years = [1, 2, 3, 4]
  return (
    <div className={styles.container}>
      <div className={styles.header}>Registration period</div>
      <div className={styles.subheader}>Buy more years now to save on fees</div>
      <div className={styles.years}>
        {years.map((year) =>
          <div
            key={year}
            className={clsx(
              styles.yearButton,
              { [styles.yearButtonSelected]: year === props.durationYears }
            )}
            onClick={() => props.onDurationChanged?.(year)}
          >
            {formatYears(year)}
          </div>
        )}
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
