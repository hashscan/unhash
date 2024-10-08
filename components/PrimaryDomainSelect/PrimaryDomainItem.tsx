import clsx from 'clsx'
import { Domain } from 'lib/types'
import React, { ComponentProps } from 'react'
import styles from './PrimaryDomainItem.module.css'

interface PrimaryDomainItemProps extends ComponentProps<'div'> {
  domain: Domain
  isPrimary: boolean
}

export const PrimaryDomainItem = ({
  domain,
  isPrimary,
  className,
  ...rest
}: PrimaryDomainItemProps) => {
  return (
    <div {...rest} className={clsx(className, styles.item, { [styles.itemSelected]: isPrimary })}>
      {domain}
    </div>
  )
}
