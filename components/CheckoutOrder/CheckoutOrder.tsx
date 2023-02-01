import { Domain } from 'lib/types'
import React from 'react'
import styles from './CheckoutOrder.module.css'
import { OrderItem } from './OrderItem'

interface CheckoutOrderProps {
  domain: Domain
}

export const CheckoutOrder = (props: CheckoutOrderProps) => {

  return (
    <div className={styles.container}>
      <span className={styles.title}>Your order</span>
      <div className={styles.items}>
        <OrderItem title={`${props.domain}`} hint={'3 years'} price={'$50'} />
      </div>
      <div className={styles.line}>
        <span>Estimated network fees</span>
        <span>$14.20</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.line}>
        <span className={styles.total}>Estimated total</span>
        <span className={styles.total}>$79.20</span>
      </div>
    </div>
  )
}
