import { ArrowDown, CheckFilled, ProgressBar } from 'components/icons'
import { useAccount, useChainId } from 'wagmi'
import styles from './profile.module.css'
import ui from 'styles/ui.module.css'
import { Domain, toNetwork } from 'lib/types'
import { formatAddress } from 'lib/utils'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'
import { ProfileCard } from 'components/ProfileCard/ProfileCard'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProfileDomainItem } from 'components/ProfileDomainItem/ProfileDomainItem'
import clsx from 'clsx'
import { useOnClickOutside } from 'usehooks-ts'
import Link from 'next/link'
import { pluralize } from 'lib/pluralize'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'

const Profile: PageWithLayout = () => {
  const chainId = useChainId()
  const { address, isDisconnected } = useAccount()
  const userInfo = useCurrentUserInfo()

  // TODO: move to a component
  // TODO: set actually available for primary ENS
  // TODO: make floating dropdown
  const [isOpen, setOpen] = useState<boolean>(false)
  const availableDomains = useMemo(() => userInfo?.domains.controlled || [], [userInfo])
  const onPrimaryClick = () => setOpen(!isOpen)
  const primaryContainerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(primaryContainerRef, () => setOpen(false))

  // TODO: move to a component
  const [newDomain, setNewDomain] = useState<Domain | null>(null)
  useEffect(() => setNewDomain(null), [chainId, address]) // reset on chain and address change

  const onSuccess = () => {
    window.location.reload()
    // so smart right?
  }
  const { write: updatePrimaryEns, isLoading: isPrimaryUpdating } = useSetPrimaryEns({
    domain: newDomain,
    onSuccess
  })
  const onDomainClick = (domain: string) => {
    setOpen(false)
    // TODO: fix types
    setNewDomain(domain === userInfo?.primaryEns ? null : (domain as Domain))
  }
  const savePrimaryEns = () => {
    if (typeof updatePrimaryEns === 'undefined') return
    updatePrimaryEns()
  }

  // TODO: handle isConnecting state when metamask asked to log in
  if (isDisconnected) return <AuthLayout />
  // TODO: skeleton
  if (!userInfo) return <p>Fetching profile from API...</p>

  return (
    <main className={styles.main}>
      <div className={styles.title}>Profile</div>
      <div className={styles.address}>{address ? formatAddress(address, 6) : null}</div>

      <div className={styles.header}>Primary ENS</div>
      <div className={styles.subheader}>
        {userInfo?.primaryEns ? (
          <span>
            Your address is linked to{' '}
            <Link
              className={styles.link}
              href={`https://${chainId === 5 ? 'goerli.' : ''}etherscan.io/address/${
                userInfo.primaryEns
              }`}
              target="_blank"
            >
              {userInfo.primaryEns}
            </Link>{' '}
            ENS domain. You can switch to another available ENS below.
          </span>
        ) : availableDomains.length > 0 ? (
          <span>You address is not linked any ENS domain. Choose one from the list below.</span>
        ) : (
          <span>
            You address is not linked any ENS domain.{' '}
            <Link className={styles.link} href="/">
              Register ENS domain
            </Link>{' '}
            and come back here.
          </span>
        )}
      </div>

      {/* TODO: move to a component */}
      {availableDomains.length > 0 && (
        <div ref={primaryContainerRef} className={styles.primaryContainer}>
          <div className={styles.primary} onClick={() => onPrimaryClick()}>
            {newDomain ? (
              <div className={clsx(styles.primaryDomain, styles.primaryHint)}>{newDomain}</div>
            ) : userInfo.primaryEns ? (
              <>
                <CheckFilled className={styles.primarySuccess} fillColor={'var(--color-success)'} />
                <div className={styles.primaryDomain}>{userInfo.primaryEns}</div>
              </>
            ) : (
              <div className={clsx(styles.primaryDomain, styles.primaryHint)}>
                {/* TODO: support pluralize without count */}
                {`Select from ${pluralize('domain', availableDomains.length)} available`}
              </div>
            )}
            <ArrowDown className={styles.primaryArrow} />
          </div>

          <div
            className={clsx(styles.primaryDomainList, { [styles.primaryDomainListOpen]: isOpen })}
          >
            {availableDomains.map((domain) => {
              return (
                <ProfileDomainItem
                  domain={domain}
                  isPrimary={domain === userInfo.primaryEns}
                  key={domain}
                  onClick={() => onDomainClick(domain)}
                />
              )
            })}
          </div>

          {newDomain && (
            <div>
              <button
                className={clsx(styles.savePrimaryButton, ui.button)}
                onClick={savePrimaryEns}
              >
                {isPrimaryUpdating ? <ProgressBar color="white" /> : 'Save'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ENS profile layout */}
      {address && userInfo?.primaryEns && (
        <>
          <div className={styles.divider}></div>
          <div className={styles.header}>ENS profile</div>
          <div className={styles.subheader}>
            This is a public profile linked to your wallet. People can find you by your ENS name.
          </div>
          <ProfileCard
            network={toNetwork(chainId)}
            address={address}
            domain={userInfo.primaryEns}
          />
        </>
      )}
    </main>
  )
}

Profile.layout = <ContainerLayout verticalPadding={false} />

export default Profile
