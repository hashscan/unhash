import { Basket } from 'components/icons'
import styles from './LandingBulk.module.css'

export const LandingBulk = () => {
  return (
    <div className={styles.bulk}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Basket width={56} height={56} />
        </div>
        <div>
          <div className={styles.header}>Bulk register and renew</div>
          <div className={styles.text}>
            Seamlessly register and renew multiple names at once in just 2 transactions. Save on gas
            fees and time.
          </div>
        </div>
      </div>

      <div className={styles.numbers}>
        <div className={styles.number}>
          <div className={styles.numberValue}>10+</div>
          <div className={styles.numberDesc}>{'names at once'}</div>
        </div>
        <div className={styles.number}>
          <div className={styles.numberValue}>~25%</div>
          <div className={styles.numberDesc}>{'saved on gas fees'}</div>
        </div>
        <div className={styles.number}>
          <div className={styles.numberValue}>~10%</div>
          <div className={styles.numberDesc}>{'cheaper than alternatives'}</div>
        </div>
      </div>
    </div>
  )
}
