/* eslint-disable @next/next/no-img-element */
import React, { ComponentProps, useCallback, useEffect } from 'react'
import styles from './BuyBadge.module.css'
import clsx from 'clsx'
import { DomainListing } from 'lib/types'
import { formatUSDPrice } from 'lib/format'
import { trackGoal } from 'lib/analytics'
import { Button } from '../Button/Button'

export interface BuyBadgeProps extends ComponentProps<'div'> {
  name: string
  listing: DomainListing
}

export const BuyBadge = ({ name, listing, className, ...rest }: BuyBadgeProps) => {
  useEffect(() => {
    trackGoal('BuyBadgeView', { props: { name: name, source: listing.source.name } })
  }, [name, listing])

  const onClick = useCallback(() => {
    trackGoal('BuyNameClick', { props: { name: name, source: listing.source.name } })
    window.open(listing.source.url, '_blank')
  }, [name, listing])

  return (
    <div {...rest} className={clsx(className, styles.badge)}>
      <img
        className={styles.logo}
        width={18}
        height={18}
        src={`https://api.reservoir.tools/redirect/sources/${listing.source.name}/logo/v2`}
        alt=""
      />
      <div className={styles.content}>
        <div className={styles.title}>
          <b>{name}</b> is for sale!
        </div>
        <div className={styles.subtitle}>{formatUSDPrice(listing.priceUsd, false)}</div>
      </div>

      <Button as={'button'} size="regular" variant="primary" onClick={onClick}>
        Buy now&nbsp;&nbsp;→
      </Button>
    </div>
  )
}
