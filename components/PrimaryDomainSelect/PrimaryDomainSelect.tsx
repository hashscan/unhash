import clsx from 'clsx'
import { ArrowDown, CheckFilled } from 'components/icons'
import { pluralize } from 'lib/pluralize'
import { Domain } from 'lib/types'
import { ComponentProps } from 'react'
import styles from './PrimaryDomainSelect.module.css'

interface PrimaryDomainSelectProps extends ComponentProps<'div'> {
  primaryDomain?: Domain // currently primary domain
  newDomain?: Domain // the domain which is about to be set, selected from dropdown
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
          {/* TODO: support pluralize without count */}
          {`Select from ${pluralize('domain', availableLength)} available`}
        </div>
      )}
      <ArrowDown className={styles.suffixIcon} />
    </div>
  )
}
