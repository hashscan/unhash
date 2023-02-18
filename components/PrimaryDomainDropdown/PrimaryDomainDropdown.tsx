import clsx from 'clsx'
import { PrimaryDomainItem } from './PrimaryDomainItem'
import { Domain } from 'lib/types'
import { ComponentProps } from 'react'
import styles from './PrimaryDomainDropdown.module.css'

interface PrimaryDomainDropdownProps extends ComponentProps<'div'> {
  domains: Domain[]
  primaryDomain?: Domain
  onDomainSelect?: (domain: Domain) => void
}

export const PrimaryDomainDropdown = ({
  domains,
  primaryDomain,
  onDomainSelect,
  className,
  ...rest
}: PrimaryDomainDropdownProps) => {
  return (
    <div {...rest} className={clsx(styles.dropdown, className)}>
      {domains.map((domain) => (
        <PrimaryDomainItem
          domain={domain}
          isPrimary={domain === primaryDomain}
          key={domain}
          onClick={() => onDomainSelect && onDomainSelect(domain)}
        />
      ))}
    </div>
  )
}
