import clsx from 'clsx'
import { ComponentProps, createElement, ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { LoaderSpinner } from 'components/icons'

import styles from './Button.module.css'

export interface ButtonProps extends ComponentProps<'button'> {
  as?: 'button' | 'a'
  size?: 'small' | 'regular' | 'medium' | 'cta'
  variant?: 'primary' | 'rounded' | 'ghost' | 'rounded-ghost'
  isLoading?: boolean
}

const ButtonWithRef = (
  {
    as = 'button',
    size = 'regular',
    variant = 'primary',
    isLoading = false,
    children,
    className,
    ...rest
  }: ButtonProps,
  ref: ForwardedRef<HTMLElement>
) => {
  const buttonProps = {
    ref,
    ...rest,
    className: clsx(
      className,
      styles.button,
      styles[`button_${size}`],
      styles[`button_variant_${variant}`],
      {
        [styles.button_loading]: isLoading
      }
    )
  }

  return createElement(
    as,
    buttonProps,
    <>
      <div className={styles.content}>{children}</div>
      {isLoading && <LoaderSpinner className={styles.loader} />}
    </>
  )
}

export const Button = forwardRef(ButtonWithRef)
