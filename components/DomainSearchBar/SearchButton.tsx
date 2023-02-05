import React, { ComponentProps } from 'react'
import { Domain } from 'lib/types'

import clsx from 'clsx'
import styles from './SearchButton.module.css'

export enum SearchStatus {
  Inactive,
  Loading,
  Available,
  NotAvailable
}

export interface DomainAvailability {
  available: boolean
  domain: Domain
  /* TODO: price, listing, etc. */
}

export interface SearchButtonProps extends ComponentProps<'div'> {
  status: SearchStatus
  availability?: DomainAvailability /* TODO */
}

const Loader = ({ visible }: { visible: boolean }) => (
  <div className={clsx(styles.loader, visible && styles.loaderVisible)} />
)

export const SearchButton = ({ status, ...props }: SearchButtonProps) => {
  return (
    <div
      {...props}
      className={clsx(styles.container, {
        // hide the entire component when not focused
        [styles.containerHidden]: status === SearchStatus.Inactive
      })}
    >
      <Loader visible={status === SearchStatus.Loading} />

      {[SearchStatus.Available, SearchStatus.NotAvailable].includes(status) && (
        <button className={styles.button}>
          Buy for $5 / year
          <div className={styles.buttonStatus}>
            {status === SearchStatus.Available ? 'available' : 'not available'}
          </div>
        </button>
      )}
    </div>
  )
}
