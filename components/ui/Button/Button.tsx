import clsx from 'clsx'
import { ComponentProps } from 'react'

import { LoaderSpinner } from 'components/icons'

import styles from './Button.module.css'

export interface ButtonProps extends ComponentProps<'button'> {
  size?: 'regular' | 'medium' | 'cta'
  isLoading?: boolean
}

export const Button = ({
  size = 'regular',
  isLoading = false,
  children,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={clsx(className, styles.button, styles[`button_${size}`], {
        [styles.button_loading]: isLoading
      })}
    >
      <span className={styles.content}>{children}</span>
      {isLoading && <LoaderSpinner className={styles.loader} />}
    </button>
  )
}