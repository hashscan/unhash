import React from 'react'
import clsx from 'clsx'

import styles from './NextSteps.module.css'

import * as Icons from 'components/icons'

interface NextStepsProps {
  domain: string
}

export const NextSteps = (props: NextStepsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.explore}>Explore the Next Steps</div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.icons}>
            <span className={styles.icon}>
              <Icons.FaceWink />
            </span>

            <span className={clsx(styles.badge, styles.badge_recommended)}>recommended</span>
          </div>

          <div className={styles.header}>Set up your public .ETH profile</div>

          <div className={styles.text}>
            <p>Boost your blockchain presence by connecting {props.domain} to your wallet.</p>

            <p>
              This lets others access your public info, like your website address, Twitter page, and
              more!
            </p>
          </div>

          <div className={styles.arrow}>→</div>
        </div>

        <div className={styles.card}>
          <div className={styles.icons}>
            <span className={styles.icon}>
              <Icons.CoinSwap />
            </span>
          </div>

          <div className={styles.header}>Trade on a Marketplace</div>

          <div className={styles.text}>
            <p>Your domain is a fully-functional Non-Fungible Token (NFT).</p>

            <p>
              You can sell it on a marketplace, transfer it to someone else, and even completely
              destroy it.
            </p>
          </div>

          <div className={styles.arrow}>→</div>
        </div>

        <div className={styles.card}>
          <div className={styles.icons}>
            <span className={styles.icon}>
              <Icons.Tool />
            </span>
          </div>

          <div className={styles.header}>Explore the Protocol Features</div>

          <div className={styles.text}>
            <p>
              Fine-tune your newly purchased ENS name: manually edit records, assign domain
              controller, extend registration period and more via the official ENS app.
            </p>
          </div>

          <div className={styles.arrow}>→</div>
        </div>
      </div>
    </div>
  )
}
