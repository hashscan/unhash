import clsx from 'clsx'
import { PrimaryDomainItem } from './PrimaryDomainItem'
import { Domain, UserDomain } from 'lib/types'
import { ComponentProps } from 'react'
import styles from './PrimaryDomainDropdown.module.css'

interface PrimaryDomainDropdownProps extends ComponentProps<'div'> {
  domains: UserDomain[]
  primaryName?: Domain // undefined if no primary ENS set
  onDomainSelect?: (domain: UserDomain) => void
}

export const PrimaryDomainDropdown = ({
  domains,
  primaryName,
  onDomainSelect,
  className,
  ...rest
}: PrimaryDomainDropdownProps) => {
  return (
    <div {...rest} className={clsx(styles.dropdown, className)}>
      {domains.map((domain) => (
        <PrimaryDomainItem
          domain={domain.name}
          isPrimary={domain.name === primaryName}
          key={domain.name}
          onClick={() => onDomainSelect && onDomainSelect(domain)}
        />
      ))}
    </div>
  )
}
