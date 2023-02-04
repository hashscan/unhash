import React from 'react'
import styles from './OrderItem.module.css'

interface OrderItemProps {
  title: string
  hint?: string
  price: string
}

export const OrderItem = (props: OrderItemProps) => {
  return (
    <div className={styles.item}>
      <span>
        {props.title}
        {props.hint && <span className={styles.hint}>{` – ${props.hint}`}</span>}
      </span>
      <span>{props.price}</span>
    </div>
  )
}
