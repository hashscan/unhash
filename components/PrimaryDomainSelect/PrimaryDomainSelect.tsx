import clsx from 'clsx'
import { ArrowDown, CheckFilled } from 'components/icons'
import { pluralize } from 'lib/pluralize'
import { Domain } from 'lib/types'
import { ComponentProps } from 'react'
import styles from './PrimaryDomainSelect.module.css'

interface PrimaryDomainSelectProps extends ComponentProps<'div'> {
  primaryDomain: Domain | null // currently primary domain or null if not set
  newDomain: Domain | null // the domain which is about to be set, selected from dropdown
  availableLength: number
}

export const PrimaryDomainSelect = ({
  primaryDomain,
  newDomain,
  availableLength,
  className,
  ...rest
}: PrimaryDomainSelectProps) => {
  return (
    <div {...rest} className={clsx(styles.select, className)}>
      {/* Show new domain hint (still not saved) */}
      {newDomain && <div className={clsx(styles.text, styles.textHint)}>{newDomain}</div>}

      {/* Show current primary domain set */}
      {!newDomain && primaryDomain && (
        <>
          <CheckFilled className={styles.prefixIcon} fillColor={'var(--color-success)'} />
          <div className={clsx(styles.text)}>{primaryDomain}</div>
        </>
      )}

      {/* Show hint to set select new domain */}
      {!newDomain && !primaryDomain && (
        <div className={clsx(styles.text, styles.textHint)}>
          {`Select from ${availableLength} available ${pluralize('domain', availableLength, true)}`}
        </div>
      )}
      <ArrowDown className={styles.suffixIcon} />
    </div>
  )
}
