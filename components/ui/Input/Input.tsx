import React, { ComponentProps } from 'react'
import styles from './Input.module.css'
import clsx from 'clsx'

export interface InputProps extends ComponentProps<'input'> {
  label?: string
  icon?: JSX.Element
  hint?: string
  error?: string
}

export const Input = ({ label, icon, hint, error, className, children, ...rest }: InputProps) => {
  return (
    <div className={clsx(styles.container)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={clsx(styles.wrapper, { [styles.wrapperHintSpace]: !error && !hint })}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <input
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
}
