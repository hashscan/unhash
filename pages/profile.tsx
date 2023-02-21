import { useAccount, useChainId } from 'wagmi'
import styles from './profile.module.css'
import { toNetwork } from 'lib/types'
import { formatAddress } from 'lib/utils'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'
import { ProfileCard } from 'components/ProfileCard/ProfileCard'
import { useMemo } from 'react'
import Link from 'next/link'
import { ProfilePrimaryDomain } from 'components/ProfilePrimaryDomain/ProfilePrimaryDomain'
import { LoaderSpinner } from 'components/icons'

const Profile: PageWithLayout = () => {
  const chainId = useChainId()
  const { address, isDisconnected } = useAccount()
  const userInfo = useCurrentUserInfo()

  // TODO: set actually available for primary ENS
  const availableDomains = useMemo(() => userInfo?.domains.controlled || [], [userInfo])

  // TODO: handle isConnecting state when metamask asked to log in
  if (isDisconnected) return <AuthLayout />

  // loader
  if (!userInfo) {
    return (
      <div className={styles.loading}>
        <LoaderSpinner className={styles.loader} />
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>Profile</div>
      <div className={styles.address}>{address ? formatAddress(address, 6) : null}</div>

      {/* Primary ENS header */}
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

      {/* Primary ENS select */}
      {userInfo && availableDomains.length > 0 && (
        <ProfilePrimaryDomain
          chainId={chainId}
          address={address}
          primaryDomain={userInfo.primaryEns}
          availableDomains={availableDomains}
        />
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
