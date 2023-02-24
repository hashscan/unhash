import styles from './ProfilePrimaryDomain.module.css'
import clsx from 'clsx'
import { PrimaryDomainSelect } from 'components/PrimaryDomainSelect/PrimaryDomainSelect'
import { Domain, UserDomain } from 'lib/types'
import { ComponentProps, useCallback, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'
import { Address } from 'wagmi'
import { PrimaryDomainDropdown } from 'components/PrimaryDomainSelect/PrimaryDomainDropdown'
import { Button } from 'components/ui/Button/Button'
import { PrimaryDomainUnresolvedEth } from 'components/PrimaryDomainSelect/PrimaryDomainUnresolvedEth'
import { trackGoal } from 'lib/analytics'

interface ProfilePrimaryDomainProps extends ComponentProps<'div'> {
  chainId: number
  address?: Address
  primaryName?: Domain // undefined if no primary ENS set
  userDomains: UserDomain[] // domains that can be set as primary ENS by current user
  onEditingChange?: (editing: boolean) => void // callback when start/stopped editing primary ens
}

export const ProfilePrimaryDomain = ({
  chainId,
  address,
  primaryName,
  userDomains,
  onEditingChange,
  className,
  ...rest
}: ProfilePrimaryDomainProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [newDomain, setNewDomain] = useState<UserDomain | undefined>(undefined)

  useEffect(() => onEditingChange?.(Boolean(newDomain)), [onEditingChange, newDomain])

  const onDomainSelect = (domain: UserDomain) => {
    setShowDropdown(false)
    setNewDomain(domain?.name === primaryName ? undefined : domain)
  }
  // reset selection if chain and address switched
  useEffect(() => setNewDomain(undefined), [chainId, address])

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setShowDropdown(false))

  // locally update new domain property when it's resolved
  const onNewDomainResolved = useCallback(
    (domain: Domain) => {
      if (newDomain && newDomain.name === domain) {
        setNewDomain({ ...newDomain, resolved: true })
      }
    },
    [newDomain, setNewDomain]
  )

  // transaction to update primary ENS
  const { write: sendUpdate, isLoading: isUpdating } = useSetPrimaryEns({
    domain: newDomain?.name,
    onSuccess: () => {
      // TODO: so smart right? make normal update
      window.location.reload()
    }
  })
  const savePrimaryEns = () => {
    trackGoal('SetPrimaryENSClick', { props: { domain: String(newDomain?.name) } })
    sendUpdate?.()
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
            <PrimaryDomainUnresolvedEth
              className={styles.unresolvedEth}
              domain={newDomain.name}
              onResolved={onNewDomainResolved}
            />
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
