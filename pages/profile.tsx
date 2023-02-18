import { ArrowDown, CheckFilled } from 'components/icons'
import { useAccount, useChainId } from 'wagmi'
import styles from './profile.module.css'
import { toNetwork } from 'lib/types'
import { formatAddress } from 'lib/utils'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'
import { ProfileCard } from 'components/ProfileCard/ProfileCard'
import { useMemo, useRef, useState } from 'react'
import { ProfileDomainItem } from 'components/ProfileDomainItem/ProfileDomainItem'
import clsx from 'clsx'
import { useOnClickOutside } from 'usehooks-ts'
import Link from 'next/link'

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
  const primaryDomainListRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(primaryDomainListRef, () => setOpen(false))

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
          `Your address is linked to ${userInfo.primaryEns} ENS domain. You can switch to another available ENS
        below.`
        ) : availableDomains.length > 0 ? (
          'You address is not linked any ENS domain. Choose one from the list below.'
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
        <div ref={primaryDomainListRef} className={styles.primaryContainer}>
          <div className={styles.primary} onClick={() => onPrimaryClick()}>
            <CheckFilled className={styles.primarySuccess} fillColor={'var(--color-success)'} />
            <div className={styles.primaryDomain}>{userInfo.primaryEns}</div>
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
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Primary ENS select */}
      {/* <div className={styles.domains}>
        <select
          className={`${ui.select} ${styles.domainSelect}`}
          defaultValue={userInfo?.primaryEns || userInfo?.domains.resolved[0]}
          onChange={(v) => setDomain(v.currentTarget.value as Domain | null)}
        >
          {userInfo?.domains.resolved.map((domain) => (
            <option key={domain} value={domain}>
              {domain === userInfo.primaryEns ? '[primary]' : ''} {domain}
            </option>
          ))}
        </select>

        <button
          className={`${ui.button} ${styles.buttonSet}`}
          onClick={() => {
            setPrimaryEns?.()
          }}
        >
          {isPrimaryEnsLoading ? <ProgressBar color="white" /> : 'Set'}{' '}
        </button>
      </div> */}

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
