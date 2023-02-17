import clsx from 'clsx'
import React from 'react'
import styles from './ProfileDomainItem.module.css'

interface ProfileDomainItemProps {
  domain: string
  isPrimary: boolean
  className?: string | undefined
}

export const ProfileDomainItem = ({ domain, isPrimary, className }: ProfileDomainItemProps) => {
  return (
    <div className={clsx(className, styles.item, { [styles.itemSelected]: isPrimary })}>
      {domain}
    </div>
  )
}
