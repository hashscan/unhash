import { BigNumber } from 'ethers'
import { COMMIT_GAS_LIMIT, REGISTER_GAS_LIMIT } from 'lib/constants'
import { formatNetworkFee, formatUSDPrice, formatYears } from 'lib/format'
import { useDomainPrice } from 'lib/hooks/useDomainPrice'
import { useTxPrice } from 'lib/hooks/useTxPrice'
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

  // fixed network fees for estimation
  const networkFeesGas = COMMIT_GAS_LIMIT + REGISTER_GAS_LIMIT
  const networkFees = useTxPrice(BigNumber.from(networkFeesGas))

  const totalPrice = domainPrice && networkFees ? domainPrice + networkFees : undefined

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your order</div>
      <OrderItem title={`${domain}`} hint={formatYears(durationYears)} price={domainPrice} />
      <div className={styles.line}>
        <span>Estimated network fees</span>
        <span>{formatNetworkFee(networkFees)}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.line}>
        <span className={styles.totalLabel}>Estimated total</span>
        <span className={styles.totalValue}>{formatUSDPrice(totalPrice)}</span>
      </div>
    </div>
  )
}
