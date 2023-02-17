import { ArrowDown, CheckFilled } from 'components/icons'
import { useAccount, useChainId } from 'wagmi'
import styles from './profile.module.css'
import { toNetwork } from 'lib/types'
import { formatAddress } from 'lib/utils'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'
import { ProfileCard } from 'components/ProfileCard/ProfileCard'

const Profile: PageWithLayout = () => {
  const chainId = useChainId()
  const { address, isDisconnected } = useAccount()

  const userInfo = useCurrentUserInfo()

  // TODO: handle isConnecting state when metamask asked to log in
  if (isDisconnected) return <AuthLayout />
  // TODO: skeleton
  if (!userInfo) return <p>Fetching profile from API...</p>

  return (
    <main className={styles.main}>
      {/* Wallet */}
      <div className={styles.header}>Your wallet</div>
      <div className={styles.subheader}>
        {userInfo?.primaryEns
          ? `Your address is linked to ${userInfo.primaryEns} ENS profile. You can switch to another available ENS
        below.`
          : 'You are not connected to any ENS profile.'}
      </div>
      <div className={styles.address}>{address ? formatAddress(address, 4) : null}</div>
      <div className={styles.primary} onClick={() => alert('ты лох')}>
        <CheckFilled className={styles.primarySuccess} fillColor={'var(--color-success)'} />
        <div className={styles.primaryDomain}>{userInfo.primaryEns}</div>
        <ArrowDown className={styles.primaryArrow} />
      </div>

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

      <div className={styles.divider}></div>

      {/* ENS profile */}
      <div className={styles.header}>ENS profile</div>
      <div className={styles.subheader}>
        This is a public profile linked to your wallet. People can find you by your ENS name.
      </div>
      {address && userInfo?.primaryEns && (
        <ProfileCard network={toNetwork(chainId)} address={address} domain={userInfo.primaryEns} />
      )}
    </main>
  )
}

Profile.layout = <ContainerLayout verticalPadding={false} />

export default Profile
