import { useAccount, useChainId } from 'wagmi'
import styles from './profile.module.css'
import { formatAddress } from 'lib/utils'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUser } from 'lib/hooks/useCurrentUser'
import { ProfileCard } from 'components/ProfileCard/ProfileCard'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ProfilePrimaryDomain } from 'components/ProfilePrimaryDomain/ProfilePrimaryDomain'
import { LoaderSpinner } from 'components/icons'
import { useEtherscanURL } from 'lib/hooks/useEtherscanURL'

const Profile: PageWithLayout = () => {
  const { address, isDisconnected } = useAccount()

  const [editingPrimaryName, setEditingPrimaryName] = useState(false)

  const { user: userInfo } = useCurrentUser()
  const primaryName = userInfo?.primaryName?.name
  const userDomains = useMemo(() => userInfo?.domains.filter((d) => d.isValid) || [], [userInfo])

  const etherscanLink = useEtherscanURL('address', primaryName!)

  // TODO: handle isConnecting state when metamask asked to log in
  if (isDisconnected)
    return <AuthLayout text="Sign in with your wallet to view and edit your public ENS profile" />

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
        {primaryName ? (
          <span>
            Your address is linked to{' '}
            <Link className={styles.link} href={etherscanLink} target="_blank">
              <b>{primaryName}</b>
            </Link>{' '}
            ENS domain. You can share your <b>.eth username</b> with people instead of wallet
            address.
          </span>
        ) : userDomains.length > 0 ? (
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
      {userInfo && userDomains.length > 0 && (
        <ProfilePrimaryDomain
          address={address}
          primaryName={primaryName || undefined}
          userDomains={userDomains}
          onEditingChange={setEditingPrimaryName}
        />
      )}

      {/* ENS profile layout */}
      {address && primaryName && !editingPrimaryName && (
        <>
          <div className={styles.divider}></div>
          <div className={styles.header}>ENS profile</div>
          <div className={styles.subheader}>
            This is your {"wallet's"} public profile on Ethereum ecosystem. People can find it by
            your address and <b>.eth username</b>.{" You can't share it yet."}
          </div>
          <ProfileCard address={address} domain={primaryName} />
        </>
      )}
    </main>
  )
}

Profile.layout = <ContainerLayout verticalPadding={false} />

export default Profile
