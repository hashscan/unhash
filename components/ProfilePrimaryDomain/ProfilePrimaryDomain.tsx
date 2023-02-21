import styles from './ProfilePrimaryDomain.module.css'
import clsx from 'clsx'
import { PrimaryDomainSelect } from 'components/PrimaryDomainSelect/PrimaryDomainSelect'
import { Domain } from 'lib/types'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'
import { Address } from 'wagmi'
import { PrimaryDomainDropdown } from 'components/PrimaryDomainSelect/PrimaryDomainDropdown'
import { Button } from 'components/ui/Button/Button'

interface ProfilePrimaryDomainProps extends ComponentProps<'div'> {
  chainId: number
  address?: Address
  primaryDomain: Domain | null // null if no primary ENS set
  availableDomains: Domain[] // domains that can be set as primary ENS by current user
}

export const ProfilePrimaryDomain = ({
  chainId,
  address,
  primaryDomain,
  availableDomains,
  className,
  ...rest
}: ProfilePrimaryDomainProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [newDomain, setNewDomain] = useState<Domain | null>(null)

  const onDomainSelect = (domain: Domain) => {
    setShowDropdown(false)
    setNewDomain(domain === primaryDomain ? null : domain)
  }
  // reset selection if chain and address switched
  useEffect(() => setNewDomain(null), [chainId, address])

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setShowDropdown(false))

  // transaction to update primary ENS
  const { write: sendUpdate, isLoading: isUpdating } = useSetPrimaryEns({
    domain: newDomain,
    onSuccess: () => {
      // TODO: so smart right? make normal update
      window.location.reload()
    }
  })
  const savePrimaryEns = () => {
    if (typeof sendUpdate === 'undefined') return
    sendUpdate()
  }

  return (
    <div {...rest} ref={ref} className={clsx(styles.container, className)}>
      <PrimaryDomainSelect
        primaryDomain={primaryDomain}
        newDomain={newDomain}
        availableLength={availableDomains.length}
        onClick={() => setShowDropdown(!showDropdown)}
      />

      <PrimaryDomainDropdown
        className={clsx(styles.dropdown, { [styles.dropdownHidden]: !showDropdown })}
        domains={availableDomains}
        primaryDomain={primaryDomain}
        onDomainSelect={onDomainSelect}
      />

      {newDomain && (
        <div>
          <Button
            className={styles.saveButton}
            isLoading={isUpdating}
            size={'regular'}
            onClick={savePrimaryEns}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
