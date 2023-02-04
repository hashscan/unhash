import { formatYears } from 'lib/format'
import { Domain } from 'lib/types'
import React from 'react'
import styles from './CheckoutOrder.module.css'
import { OrderItem } from './OrderItem'

interface CheckoutOrderProps {
  domain: Domain
  durationYears: number
}

export const CheckoutOrder = (props: CheckoutOrderProps) => {
  // TODO: calculate with api?
  const pricePerYear = 5
  const domainPrice = props.durationYears * pricePerYear
  const networkFees = 14.2
  const totalPrice = domainPrice + networkFees

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your order</div>
      <OrderItem
        title={`${props.domain}`}
        hint={formatYears(props.durationYears)}
        price={`$${domainPrice}`}
      />
      <div className={styles.line}>
        <span>Estimated network fees</span>
        <span>{`$${networkFees}`}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.line}>
        <span className={styles.total}>Estimated total</span>
        <span className={styles.total}>{`$${totalPrice}`}</span>
      </div>
    </div>
  )
}
