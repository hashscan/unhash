import React, { ComponentProps } from 'react'

import clsx from 'clsx'
import styles from './SearchButton.module.css'
import { SearchStatus } from './types'

export interface SearchButtonProps extends ComponentProps<'div'> {
  status: SearchStatus
  focused: boolean
}

const Loader = ({ status, focused }: { status: SearchStatus; focused: boolean }) => (
  <div
    className={clsx(styles.loader, {
      [styles.loaderVisible]: focused,
      [styles.loaderActive]: [SearchStatus.Loading].includes(status)
    })}
  >
    <div className={styles.loaderSpinner}></div>
  </div>
)

export const SearchButton = ({ status, focused, ...props }: SearchButtonProps) => {
  return (
    <div {...props} className={clsx(styles.container)}>
      <Loader status={status} focused={focused} />

      <button className={clsx(styles.button)} disabled={status !== SearchStatus.Available}>
        Register
      </button>
    </div>
  )
}
