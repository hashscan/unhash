import clsx from 'clsx'
import { ArrowDown, RenewClock } from 'components/icons'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { formatUSDPrice } from 'lib/format'
import { useDomainPrice } from 'lib/hooks/useDomainPrice'
import { pluralize } from 'lib/pluralize'
import { Domain } from 'lib/types'
import { ComponentProps } from 'react'
import styles from './RenewYearSelect.module.css'

interface RenewYearSelectProps extends ComponentProps<'div'> {
  name: Domain
  years: number
  onYearChange: (years: number) => void
}

export const RenewYearSelect = ({
  name,
  years,
  onYearChange,
  className,
  ...rest
}: RenewYearSelectProps) => {
  const price = useDomainPrice(name, years * YEAR_IN_SECONDS)

  return (
    <div {...rest} className={clsx(styles.select, className)}>
      <div className={styles.prefixWrapper}>
        <RenewClock className={styles.prefixIcon} />
      </div>
      <div className={styles.year}>{pluralize('year', years)}</div>
      <div className={styles.cost}>{price && formatUSDPrice(price.usd, false)}</div>
      <div className={styles.suffixWrapper}>
        <ArrowDown className={styles.suffixIcon} />
      </div>
    </div>
  )
}
