import clsx from 'clsx'
import { ArrowDown, CheckFilled } from 'components/icons'
import { pluralize } from 'lib/pluralize'
import { Domain, UserDomain } from 'lib/types'
import { ComponentProps } from 'react'
import styles from './PrimaryDomainSelect.module.css'

interface PrimaryDomainSelectProps extends ComponentProps<'div'> {
  primaryName?: Domain // currently primary domain or undefined if not set
  newDomain?: UserDomain // the domain which is about to be set, selected from dropdown
  availableLength: number
}

export const PrimaryDomainSelect = ({
  primaryName,
  newDomain,
  availableLength,
  className,
  ...rest
}: PrimaryDomainSelectProps) => {
  return (
    <div {...rest} className={clsx(styles.select, className)}>
      {/* Show new domain hint (still not saved) */}
      {newDomain && <div className={clsx(styles.text, styles.textHint)}>{newDomain.name}</div>}

      {/* Show current primary name set */}
      {!newDomain && primaryName && (
        <>
          <CheckFilled className={styles.prefixIcon} fillColor={'var(--color-success)'} />
          <div className={clsx(styles.text)}>{primaryName}</div>
        </>
      )}

      {/* Show hint to set select new domain */}
      {!newDomain && !primaryName && (
        <div className={clsx(styles.text, styles.textHint)}>
          {`Select from ${availableLength} available ${pluralize('domain', availableLength, true)}`}
        </div>
      )}
      <ArrowDown className={styles.suffixIcon} />
    </div>
  )
}
