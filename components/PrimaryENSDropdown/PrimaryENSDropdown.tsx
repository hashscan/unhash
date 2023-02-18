import clsx from 'clsx'
import { ProfileDomainItem } from 'components/ProfileDomainItem/ProfileDomainItem'
import { Domain } from 'lib/types'
import { ComponentProps } from 'react'
import styles from './PrimaryENSDropdown.module.css'

interface PrimaryENSDropdownProps extends ComponentProps<'div'> {
  domains: Domain[]
  primaryDomain?: Domain
  onDomainSelect?: (domain: Domain) => void
}

export const PrimaryENSDropdown = ({
  domains,
  primaryDomain,
  onDomainSelect,
  className,
  ...rest
}: PrimaryENSDropdownProps) => {
  return (
    <div {...rest} className={clsx(styles.dropdown, className)} >
      {domains.map((domain) => (
        <ProfileDomainItem
          domain={domain}
          isPrimary={domain === primaryDomain}
          key={domain}
          onClick={() => onDomainSelect && onDomainSelect(domain)}
        />
      ))}
    </div>
  )
}
