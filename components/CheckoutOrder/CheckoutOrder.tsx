import { formatUSDPrice, formatYears } from 'lib/format'
import { useDomainPrice } from 'lib/hooks/useDomainPrice'
import { Domain } from 'lib/types'
import React from 'react'
import styles from './CheckoutOrder.module.css'
import { OrderItem } from './OrderItem'

interface CheckoutOrderProps {
  domain: Domain
  durationYears: number
}

export const CheckoutOrder = ({ domain, durationYears }: CheckoutOrderProps) => {
  // get domain price from api
  const domainPrice = useDomainPrice(domain, durationYears)
  // TODO: calculate network fees with api or ethers
  const networkFees: number | undefined = 14.2
  const totalPrice = domainPrice && networkFees ? domainPrice + networkFees : undefined

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your order</div>
      <OrderItem title={`${domain}`} hint={formatYears(durationYears)} price={domainPrice} />
      <div className={styles.line}>
        <span>Estimated network fees</span>
        <span>{`$${networkFees}`}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.line}>
        <span className={styles.total}>Estimated total</span>
        <span className={styles.total}>{formatUSDPrice(totalPrice)}</span>
      </div>
    </div>
  )
}
