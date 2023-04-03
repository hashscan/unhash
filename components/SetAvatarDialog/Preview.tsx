import React from 'react'

import styles from './Preview.module.css'
import clsx from 'clsx'

import { formatAddress } from 'lib/utils'

type PreviewProps = {
  visible: boolean
  avatarImg?: string
  name?: string
  address?: string
}

export const Preview = ({ visible, avatarImg, name, address }: PreviewProps) => {
  return (
    <div className={clsx(styles.preview, { [styles.preview_visible]: visible })}>
      <div className={styles.account}>
        <div className={styles.avatar}>
          {/* we don't want to use image optimization for external images here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {avatarImg && <img src={avatarImg} alt={`ENS Avatar for ${address}`} />}
        </div>

        <div className={styles.info}>
          {name && <div className={styles.ensName}>{name}</div>}
          {address && <div className={styles.address}>{formatAddress(address, 6)}</div>}
        </div>
      </div>
    </div>
  )
}
