import React, { ComponentProps, MouseEventHandler } from 'react'

import clsx from 'clsx'
import styles from './SearchButton.module.css'
import { SearchStatus } from './types'
import { LoaderHorseshoe } from 'components/icons'

export interface SearchButtonProps extends ComponentProps<'div'> {
  status: SearchStatus
  isNavigating: boolean
}

const Loader = ({ status, isNavigating }: SearchButtonProps) => (
  <div
    className={clsx(styles.loader, {
      [styles.loaderActive]: isNavigating || status === SearchStatus.Loading
    })}
  >
    <LoaderHorseshoe />
  </div>
)

export const SearchButton = (props: SearchButtonProps) => {
  const { status, isNavigating, onClick, ...restProps } = props

  const isButtonDisabled = isNavigating || status !== SearchStatus.Available

  return (
    <div {...restProps} className={clsx(styles.container)}>
      <Loader {...props} />

      <button
        onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
        className={clsx(styles.button)}
        disabled={isButtonDisabled}
      >
        Register&nbsp;&nbsp;→
      </button>
    </div>
  )
}
