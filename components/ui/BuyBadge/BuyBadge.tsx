/* eslint-disable @next/next/no-img-element */
import React, { ComponentProps } from 'react'
import styles from './BuyBadge.module.css'
import clsx from 'clsx'
import { DomainListing } from 'lib/types'
import { formatUSDPrice } from 'lib/format'

export interface BuyBadgeProps extends ComponentProps<'a'> {
  listing: DomainListing
}

export const BuyBadge = ({ listing, className, ...rest }: BuyBadgeProps) => {
  return (
    <a
      {...rest}
      className={clsx(className, styles.badge)}
      href={listing.source.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className={styles.logo}
        width={18}
        height={18}
        src={`https://api.reservoir.tools/redirect/sources/${listing.source.name}/logo/v2`}
        alt=""
      />
      <span>
        Buy now on <b>{listing.source.name}</b> for <b>{formatUSDPrice(listing.priceUsd, false)}</b>{' '}
        ↗
      </span>
    </a>
  )
}
