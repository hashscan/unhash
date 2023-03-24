import clsx from 'clsx'
import { ArrowDown, RenewClock } from 'components/icons'
import { formatUSDPrice } from 'lib/format'
import { pluralize } from 'lib/pluralize'
import { ComponentProps, useState } from 'react'
import styles from './RenewYearSelect.module.css'

interface RenewYearSelectProps extends ComponentProps<'div'> {
  years: number
  onYearChange: (years: number) => void
}

export const RenewYearSelect = ({
  years,
  onYearChange,
  className,
  ...rest
}: RenewYearSelectProps) => {
  const [cost, setCost] = useState(20)

  // TODO: fetch cost preview
  // TODO: use system select to show options

  return (
    <div {...rest} className={clsx(styles.select, className)}>
      <div className={styles.prefixWrapper}>
        <RenewClock className={styles.prefixIcon} />
      </div>
      <div className={styles.year}>{pluralize('year', years)}</div>
      <div className={styles.cost}>{formatUSDPrice(cost, false)}</div>
      <div className={styles.suffixWrapper}>
        <ArrowDown className={styles.suffixIcon} />
      </div>
    </div>
  )
}
