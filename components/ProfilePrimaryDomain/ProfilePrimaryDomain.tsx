import styles from './ProfilePrimaryDomain.module.css'
import clsx from 'clsx'
import { PrimaryDomainSelect } from 'components/PrimaryDomainSelect/PrimaryDomainSelect'
import { Domain, UserDomain } from 'lib/types'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'
import { Address } from 'wagmi'
import { PrimaryDomainDropdown } from 'components/PrimaryDomainSelect/PrimaryDomainDropdown'
import { Button } from 'components/ui/Button/Button'
import { PrimaryDomainUnresolvedEth } from 'components/PrimaryDomainSelect/PrimaryDomainUnresolvedEth'

interface ProfilePrimaryDomainProps extends ComponentProps<'div'> {
  chainId: number
  address?: Address
  primaryName?: Domain // undefined if no primary ENS set
  userDomains: UserDomain[] // domains that can be set as primary ENS by current user
}

export const ProfilePrimaryDomain = ({
  chainId,
  address,
  primaryName,
  userDomains,
  className,
  ...rest
}: ProfilePrimaryDomainProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [newDomain, setNewDomain] = useState<UserDomain | undefined>(undefined)

  const onDomainSelect = (domain: UserDomain) => {
    setShowDropdown(false)
    setNewDomain(domain?.name === primaryName ? undefined : domain)
  }
  // reset selection if chain and address switched
  useEffect(() => setNewDomain(undefined), [chainId, address])

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setShowDropdown(false))

  // transaction to update primary ENS
  const { write: sendUpdate, isLoading: isUpdating } = useSetPrimaryEns({
    domain: newDomain?.name,
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
        primaryName={primaryName}
        newDomain={newDomain}
        availableLength={userDomains.length}
        onClick={() => setShowDropdown(!showDropdown)}
      />

      <PrimaryDomainDropdown
        className={clsx(styles.dropdown, { [styles.dropdownHidden]: !showDropdown })}
        domains={userDomains}
        primaryName={primaryName}
        onDomainSelect={onDomainSelect}
      />

      {newDomain && (
        <>
          {!newDomain.resolved ? (
            <PrimaryDomainUnresolvedEth className={styles.unresolvedEth} domain={newDomain.name} />
          ) : (
            <Button
              className={styles.saveButton}
              disabled={!newDomain.resolved}
              isLoading={isUpdating}
              size={'regular'}
              onClick={savePrimaryEns}
            >
              Save
            </Button>
          )}
        </>
      )}
    </div>
  )
}
