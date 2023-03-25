import clsx from 'clsx'
import { ArrowDown, RenewClock } from 'components/icons'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { formatUSDPrice } from 'lib/format'
import { useDomainPrice } from 'lib/hooks/useDomainPrice'
import { pluralize } from 'lib/pluralize'
import { Domain } from 'lib/types'
import { ComponentProps, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import styles from './RenewYearSelect.module.css'

interface YearsDropdownProps extends ComponentProps<'div'> {
  yearOptions: number[]
  onYearSelect: (year: number) => void
}
// TODO: replace by a general purpose dropdown component
const YearsDropdown = ({ className, yearOptions, onYearSelect }: YearsDropdownProps) => {
  return (
    <div className={clsx(styles.dropdown, className)}>
      {yearOptions.map((year) => (
        <div
          className={styles.dropdownItem}
          key={year}
          onClick={(e) => {
            e.stopPropagation()
            onYearSelect(year)
          }}
        >
          {pluralize('year', year)}
        </div>
      ))}
    </div>
  )
}

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
  const yearOptions = [1, 2, 3, 4, 5, 10, 20, 50]
  const [showSelect, setShowSelect] = useState(false)

  const price = useDomainPrice(name, years * YEAR_IN_SECONDS, true)

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setShowSelect(false))

  return (
    <div
      className={clsx(styles.select, className)}
      ref={ref}
      onClick={() => setShowSelect(true)}
      {...rest}
    >
      {/* TODO: make good dropdown component */}
      {showSelect && (
        <YearsDropdown
          yearOptions={yearOptions}
          onYearSelect={(year) => {
            setShowSelect(false)
            onYearChange(year)
          }}
        />
      )}
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
