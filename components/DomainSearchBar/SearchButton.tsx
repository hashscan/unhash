import { ComponentProps, MouseEventHandler } from 'react'

import clsx from 'clsx'
import styles from './SearchButton.module.css'
import { SearchStatus } from './types'
import { LoaderSpinner } from 'components/icons'

import { Button } from 'components/ui/Button/Button'

export interface SearchButtonProps extends ComponentProps<'div'> {
  status: SearchStatus
  isNavigating: boolean
  isBulk?: boolean
  onBulk: () => void
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

const Bulk = ({ onBulk, status, isNavigating }: SearchButtonProps) => {
  const isButtonDisabled = !(isNavigating || status !== SearchStatus.Available)
  return (
    <>
      {isButtonDisabled && (
        <Button className={styles.bulk} variant="ghost" size="cta" onClick={onBulk}>
          +
        </Button>
      )}
    </>
  )
}

export const SearchButton = (props: SearchButtonProps) => {
  const { status, isNavigating, onClick, isBulk, ...restProps } = props

  // TODO: better condition
  const isButtonDisabled =
    (!isBulk || status !== SearchStatus.Idle) && (isNavigating || status !== SearchStatus.Available)

  return (
    <div {...restProps} className={clsx(styles.container)}>
      <Loader {...props} />
      <Bulk {...props} />

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
