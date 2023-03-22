import clsx from 'clsx'
import { ComponentProps, createElement, ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { LoaderSpinner } from 'components/icons'

import styles from './Button.module.css'

interface ButtonAsButton extends ComponentProps<'button'> {
  as?: 'button' | 'a'
  size?: 'regular' | 'medium' | 'cta'
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
}

interface ButtonAsA extends ComponentProps<'a'> {
  as?: 'a'
  size?: 'regular' | 'medium' | 'cta'
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
}

export type ButtonProps = ButtonAsButton | ButtonAsA

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
      styles[`button_${variant}`],
      {
        [styles.button_loading]: isLoading
      }
    )
  }

  return createElement(
    as,
    // @ts-ignore
    buttonProps,
    <>
      <div className={styles.content}>{children}</div>
      {isLoading && <LoaderSpinner className={styles.loader} />}
    </>
  )
}

export const Button = forwardRef(ButtonWithRef)
