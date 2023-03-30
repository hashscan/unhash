import { BigNumber } from 'ethers'
import { formatNetworkFee, formatUSDPrice } from 'lib/format'
import { pluralize } from 'lib/pluralize'
import { COMMIT_GAS_LIMIT, REGISTER_AVERAGE_GAS, YEAR_IN_SECONDS } from 'lib/constants'
import { useDomainPrice } from 'lib/hooks/useDomainPrice'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { RegistrationOrder } from 'lib/types'
import React from 'react'
import styles from './CheckoutOrder.module.css'
import { OrderItem } from './OrderItem'
import clsx from 'clsx'

import { CommitButton } from './CommitButton'

interface CheckoutOrderProps {
  order: RegistrationOrder
}

export const CheckoutOrder = ({ order }: CheckoutOrderProps) => {
  const { names: domain, durationInYears } = order

  const durationInSeconds = durationInYears * YEAR_IN_SECONDS

  // get domain price from api
  const domainPrice = useDomainPrice(domain[0], durationInSeconds)?.usd

  // fixed network fees for estimation
  const networkFeesGas = COMMIT_GAS_LIMIT + REGISTER_AVERAGE_GAS
  const networkFees = useTxPrice(BigNumber.from(networkFeesGas))

  const totalPrice = domainPrice && networkFees ? domainPrice + networkFees : undefined

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your Order</div>

      <div className={styles.summary}>
        <OrderItem
          className={styles.line}
          title={`${domain}`}
          hint={pluralize('year', durationInYears)}
          price={domainPrice}
        />

        <div className={styles.line}>
          <div className={styles.fees}>Estimated network fees</div>
          <div className={styles.fees}>{formatNetworkFee(networkFees)}</div>
        </div>

        <div className={clsx(styles.line, styles.lineTotal)}>
          <div className={styles.totalLabel}>Estimated total</div>
          <div className={styles.totalValue}>{formatUSDPrice(totalPrice)}</div>
        </div>
      </div>

      <CommitButton order={order} />

      {/* only on mobiles */}
      <div className={styles.mobileTotal}>Estimated total {formatUSDPrice(totalPrice)}</div>
    </div>
  )
}
