import React, { ComponentPropsWithoutRef, forwardRef } from 'react'
import styles from './Input.module.css'
import clsx from 'clsx'

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string
  icon?: JSX.Element
  hint?: string
  error?: string
  labelClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function InputWithRef(
  { label, icon, hint, error, className, labelClassName, children, ...rest },
  ref
) {
  return (
    <div className={clsx(styles.container)}>
      {label && <div className={clsx(styles.label, labelClassName)}>{label}</div>}
      <div className={clsx(styles.wrapper, { [styles.wrapperHintSpace]: !error && !hint })}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <input
          ref={ref}
          {...rest}
          className={clsx(styles.input, className, {
            [styles.inputWithIcon]: icon !== undefined,
            [styles.inputError]: error
          })}
        >
          {children}
        </input>
      </div>
      {(error || hint) && (
        <div className={clsx(styles.hint, { [styles.error]: Boolean(error) })}>{error || hint}</div>
      )}
    </div>
  )
})
