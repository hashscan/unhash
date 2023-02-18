import clsx from 'clsx'
import React, { ComponentProps } from 'react'
import styles from './ProfileDomainItem.module.css'

interface ProfileDomainItemProps extends ComponentProps<'div'> {
  domain: string
  isPrimary: boolean
}

export const ProfileDomainItem = ({
  domain,
  isPrimary,
  className,
  ...rest
}: ProfileDomainItemProps) => {
  return (
    <div {...rest} className={clsx(className, styles.item, { [styles.itemSelected]: isPrimary })}>
      {domain}
    </div>
  )
}
