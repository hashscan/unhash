import { formatUSDPrice } from 'lib/format'
import React from 'react'

import clsx from 'clsx'
import styles from './OrderItem.module.css'

interface OrderItemProps {
  title: string
  hint?: string
  price?: number
  className?: string
}

export const OrderItem = ({ className, title, hint, price }: OrderItemProps) => {
  return (
    <div className={clsx(styles.item, className)}>
      <span>
        {title}
        {hint && <span className={styles.hint}>{` – ${hint}`}</span>}
      </span>
      <span>{formatUSDPrice(price)}</span>
    </div>
  )
}
