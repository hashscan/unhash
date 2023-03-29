import { BigNumber } from 'ethers'
import { formatNetworkFee, formatUSDPrice } from 'lib/format'
import { pluralize } from 'lib/pluralize'
import { COMMIT_GAS_LIMIT, REGISTER_AVERAGE_GAS, YEAR_IN_SECONDS } from 'lib/constants'
import { useDomainPrices } from 'lib/hooks/useDomainPrices'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { RegistrationOrder } from 'lib/types'
import { useMemo } from 'react'
import styles from './CheckoutOrder.module.css'
import { OrderItem } from './OrderItem'
import clsx from 'clsx'

import { CommitButton } from './CommitButton'
import { notNull } from 'lib/utils'

interface CheckoutOrderProps {
  order: RegistrationOrder
}

export const CheckoutOrder = ({ order }: CheckoutOrderProps) => {
  const { names, durationInYears } = order

  const durationInSeconds = durationInYears * YEAR_IN_SECONDS

  // get domain price from api
  const domainPrices = useDomainPrices(names, durationInSeconds)

  // fixed network fees for estimation
  const networkFeesGas = COMMIT_GAS_LIMIT + REGISTER_AVERAGE_GAS
  const networkFees = useTxPrice(BigNumber.from(networkFeesGas))

  const totalPrice = useMemo(() => {
    const sum = Object.values(domainPrices)
      .filter(notNull)
      .map(({ usd }) => usd)
      .reduce((sum, next) => sum + next, 0)

    if (sum > 0 && networkFees) {
      return sum + networkFees
    } else {
      return undefined
    }
  }, [domainPrices, networkFees])

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your Order</div>

      <div className={styles.summary}>
        {names.map((name) => (
          <OrderItem
            key={name}
            className={styles.line}
            title={`${name}`}
            hint={pluralize('year', durationInYears)}
            price={domainPrices[name]?.usd}
          />
        ))}

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
