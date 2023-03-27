import React from 'react'
import clsx from 'clsx'

import styles from './Navigation.module.css'

type Props = {
  tab: 'nft' | 'artwork' | 'upload'
}

export const Navigation = (props: Props) => {
  return (
    <div className={styles.tabs}>
      <div className={clsx(styles.tab, { [styles.tabActive]: props.tab === 'nft' })}>
        Use your NFTs
      </div>

      <div
        className={clsx(styles.tab, styles.tabWIP, { [styles.tabActive]: props.tab === 'upload' })}
      >
        Upload Image<span className={styles.tabBadge}>WIP</span>
      </div>

      <div
        className={clsx(styles.tab, styles.tabWIP, { [styles.tabActive]: props.tab === 'artwork' })}
      >
        NFT Artwork
      </div>
    </div>
  )
}
