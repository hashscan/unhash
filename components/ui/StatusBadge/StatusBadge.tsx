import React, { ComponentProps } from 'react'

import styles from './StatusBadge.module.css'
import clsx from 'clsx'

export interface StatusBadgeProps extends ComponentProps<'div'> {
  led?: 'error' | 'warning' | 'success' | 'info' | false
}

export const StatusBadge = ({ led = 'info', className, children, ...rest }: StatusBadgeProps) => {
  return (
    <div {...rest} className={clsx(className, styles.badge, styles[led || 'none'])}>
      <span>{children}</span>
    </div>
  )
}
