import { formatUSDPrice } from 'lib/format'
import React from 'react'
import styles from './OrderItem.module.css'

interface OrderItemProps {
  title: string
  hint?: string
  price?: number
}

export const OrderItem = ({ title, hint, price }: OrderItemProps) => {
  return (
    <div className={styles.item}>
      <span>
        {title}
        {hint && <span className={styles.hint}>{` – ${hint}`}</span>}
      </span>
      <span>{formatUSDPrice(price)}</span>
    </div>
  )
}
