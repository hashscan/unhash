/* eslint-disable @next/next/no-img-element */
import { ArrowDown, CheckFilled, ProgressBar } from 'components/icons'
import { FormEvent, useState } from 'react'
import { Address, useAccount, useChainId, useEnsAvatar } from 'wagmi'
import ui from 'styles/ui.module.css'
import styles from './profile.module.css'
import { Domain, Fields } from 'lib/types'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import { useIsMounted } from 'usehooks-ts'
import { formatAddress } from 'lib/utils'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import clsx from 'clsx'
import { Input } from 'components/ui/Input/Input'
import {
  Profile as ProfileIcon,
  Description as DescriptionIcon,
  Globe as GlobeIcon,
  Twitter as TwitterIcon
} from 'components/icons'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'

const Avatar = ({ chainId, address }: { chainId: number; address?: Address }) => {
  // TODO: display avatar from selected domain not current wallet
  const { data: avatar } = useEnsAvatar({ chainId, address })

  return (
    <div className={styles.avatarWrapper}>
      {address && avatar && (
        <img className={styles.avatar} width={56} height={56} src={avatar} alt="" />
      )}
    </div>
  )
}

const Profile: PageWithLayout = () => {
  const { address, isDisconnected } = useAccount()
  const chainId = useChainId()

  // TODO: do all this only when address available
  
  const userInfo = useCurrentUserInfo()
  // TODO: then, do card only when address with primary ENS domain available
  // TODO: fetch primary ENS domain for userInfo?.primaryEns

  // input values
  const [name, setName] = useState<string>('')
  // TODO: add other values

  const [fields, setFields] = useState<Fields>({})
  const [domain, setDomain] = useState<Domain | null>(null)

  const { isLoading, write, error } = useSendSetFields({ domain, fields })
  const isMounted = useIsMounted()

  // TODO: save and validate using React state
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (e.currentTarget.reportValidity()) {
      const fd = new FormData(e.currentTarget)
      const f: Fields = {}

      for (const [k, v] of fd.entries()) {
        f[k] = v as string
      }

      setFields(f)

      if (typeof write !== 'undefined') write()
    }
  }

  if (isDisconnected) return <AuthLayout />
  if (!userInfo) return <p>Fetching profile from API...</p>
  // TODO: what's this state for?
  if (!isMounted()) return <p>Loading to get mounted...</p>

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

      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <Avatar {...{ chainId, address }} />
          <div>
            <div className={styles.profileDomain}>{userInfo.primaryEns}</div>
            <div className={styles.profileLabels}>
              <div className={styles.profileLabel}>Primary ENS</div>
              <div className={styles.profileLabel}>Owner</div>
              <div className={styles.profileLabel}>Controller</div>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <Input
            label="Name"
            placeholder="Mastodon"
            icon={<ProfileIcon />}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Description"
            placeholder="Mastodon"
            icon={<DescriptionIcon />}
            autoComplete="off"
            // onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            label="Website"
            placeholder="https://mastodon.social"
            icon={<GlobeIcon />}
            autoComplete="off"
            // onChange={(e) => setWebsite(e.target.value)}
          />
          <Input
            label="Twitter"
            placeholder="@mastodon"
            icon={<TwitterIcon />}
            autoComplete="off"
            // onChange={(e) => setTwitter(e.target.value)}
          />

          {/* Save button */}
          {error && <div className={ui.error}>{error.message}</div>}
          <button type="submit" disabled={isLoading} className={clsx(styles.saveButton, ui.button)}>
            {isLoading ? <ProgressBar color="white" /> : 'Save'}
          </button>
          {/* {networkFee && (
          <div className={styles.txFee}>
            <div className={styles.txFeeLabel}>
              <Gas />
              Network fee
            </div>
            <div className={styles.txFeeValue} title={gasLimit && `${gasLimit} gas`}>
              {formatNetworkFee(networkFee)}
            </div>
          </div>
        )} */}
        </form>
      </div>
    </main>
  )
}

Profile.layout = <ContainerLayout verticalPadding={false} />

export default Profile
