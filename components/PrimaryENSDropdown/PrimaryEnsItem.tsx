import clsx from 'clsx'
import React, { ComponentProps } from 'react'
import styles from './PrimaryEnsItem.module.css'

interface PrimaryEnsItemProps extends ComponentProps<'div'> {
  domain: string
  isPrimary: boolean
}

export const PrimaryEnsItem = ({
  domain,
  isPrimary,
  className,
  ...rest
}: PrimaryEnsItemProps) => {
  return (
    <div {...rest} className={clsx(className, styles.item, { [styles.itemSelected]: isPrimary })}>
      {domain}
    </div>
  )
}
