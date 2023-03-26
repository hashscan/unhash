import clsx from 'clsx'
import type { PropsWithChildren, ComponentProps } from 'react'

import { LoaderSpinner } from 'components/icons'

import styles from './TransactionButton.module.css'

type TransactionButtonProps = {
  status?: 'idle' | 'commit' | 'processing'
  size?: 'regular' | 'medium' | 'cta'
  className?: string
} & ComponentProps<'button'>

export function TransactionButton({
  children,
  size = 'regular',
  status = 'idle',
  className,
  ...rest
}: PropsWithChildren<TransactionButtonProps>) {
  return (
    <button
      {...rest}
      className={clsx(className, styles.button, styles[`button_${size}`], styles[`bt_${status}`])}
    >
      <span className={clsx(styles.status, styles['status_idle'])}>{children}</span>
      <span className={clsx(styles.status, styles['status_commit'])}>
        <LoaderSpinner className={styles.loader} /> Sending…
      </span>
      <span className={clsx(styles.status, styles['status_processing'])}>
        <LoaderSpinner className={styles.loader} /> Processing…
      </span>
    </button>
  )
}
