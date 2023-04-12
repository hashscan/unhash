import { ComponentProps, MouseEventHandler } from 'react'

import clsx from 'clsx'
import styles from './SearchButton.module.css'
import { SearchStatus } from './types'
import { LoaderSpinner } from 'components/icons'

export interface SearchButtonProps extends ComponentProps<'div'> {
  status: SearchStatus
  isNavigating: boolean
  isBulkEnabled?: boolean
}

const Loader = ({ status, isNavigating }: SearchButtonProps) => (
  <div
    className={clsx(styles.loader, {
      [styles.loaderActive]: isNavigating || status === SearchStatus.Loading
    })}
  >
    <LoaderSpinner animationSpeed="0.4s" />
  </div>
)

export const SearchButton = (props: SearchButtonProps) => {
  const { status, isNavigating, onClick, isBulkEnabled, ...restProps } = props

  const isButtonDisabled = isNavigating || status !== SearchStatus.Available

  return (
    <div {...restProps} className={clsx(styles.container)}>
      <Loader {...props} />

      <button
        onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
        className={clsx(styles.button, isBulkEnabled && styles.shrinkSize)}
        disabled={isButtonDisabled}
      >
        {isBulkEnabled ? <>+&nbsp;&nbsp;Add to Cart</> : <>Register&nbsp;&nbsp;→</>}
      </button>
    </div>
  )
}
