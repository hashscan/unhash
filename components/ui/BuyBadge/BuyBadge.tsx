/* eslint-disable @next/next/no-img-element */
import React, { ComponentProps, useCallback, useEffect } from 'react'
import styles from './BuyBadge.module.css'
import clsx from 'clsx'
import { DomainListing } from 'lib/types'
import { formatUSDPrice } from 'lib/format'
import { trackGoal } from 'lib/analytics'

export interface BuyBadgeProps extends ComponentProps<'a'> {
  name: string
  listing: DomainListing
}

export const BuyBadge = ({ name, listing, className, ...rest }: BuyBadgeProps) => {
  useEffect(() => {
    trackGoal('BuyBadgeView', { props: { name: name, source: listing.source.name } })
  }, [name, listing])

  const onClick = useCallback(() => {
    trackGoal('BuyNameClick', { props: { name: name, source: listing.source.name } })
  }, [name, listing])

  return (
    <a
      {...rest}
      className={clsx(className, styles.badge)}
      href={listing.source.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
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
