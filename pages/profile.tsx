/* eslint-disable @next/next/no-img-element */
import { ArrowDown, CheckFilled, Gas, ProgressBar } from 'components/icons'
import api, { UserInfo } from 'lib/api'
import { FormEvent, useEffect, useState } from 'react'
import { Address, useAccount, useChainId, useEnsAvatar } from 'wagmi'
import ui from 'styles/ui.module.css'
import styles from './profile.module.css'
import { Domain, Fields, toNetwork } from 'lib/types'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'
import { useIsMounted } from 'usehooks-ts'
import { formatAddress } from 'lib/utils'
import { formatNetworkFee } from 'lib/format'
import clsx from 'clsx'
import { Input } from 'components/ui/Input/Input'
import {
  Profile as ProfileIcon,
  Description as DescriptionIcon,
  Globe as GlobeIcon,
  Twitter as TwitterIcon
} from 'components/icons'

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

// const Input: React.FC<
//   JSX.IntrinsicElements['input'] & { name: string; fields: Fields | null; label: string }
// > = ({ fields, name, label, ...props }) => {
//   const [value, setValue] = useState('')

//   useEffect(() => {
//     if (fields) setValue(fields[name]!)
//   }, [fields, name])

//   return (
//     <div className={styles.field}>
//       <label htmlFor={name}>{label}</label>
//       <input
//         {
//           ...props /* see https://stackoverflow.com/a/49714237/11889402 */
//         }
//         className={clsx(ui.input, styles.input)}
//         value={value}
//         name={name}
//         onChange={(e) => setValue(e.currentTarget.value)}
//       />
//     </div>
//   )
// }

const Profile = () => {
  const { address, isDisconnected } = useAccount()
  const chainId = useChainId()

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  // input values
  const [name, setName] = useState<string>('')
  // TODO: add other values

  const [fields, setFields] = useState<Fields>({})
  const [domain, setDomain] = useState<Domain | null>(null)

  const { isLoading, write, error, gasLimit } = useSendSetFields({ domain, fields })
  const isMounted = useIsMounted()

  const networkFee = useTxPrice(gasLimit)

  // TODO: refactor
  useEffect(() => {
    if (address)
      api.userInfo(address, toNetwork(chainId)).then((res) => {
        setUserInfo(res)

        if (domain) {
          setFields({})
          api.domainInfo(domain, toNetwork(chainId)).then((res) => {
            setFields(res.records)
          })
        } else {
          setDomain(res.primaryEns)
        }
      })
  }, [address, chainId, domain])

  const { isLoading: isPrimaryEnsLoading, write: setPrimaryEns } = useSetPrimaryEns({
    domain,
    onSuccess: () => {
      if (userInfo) setUserInfo(() => ({ ...userInfo, primaryEns: domain! }))
    }
  })

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

  if (isDisconnected) return <p>Please connect wallet</p>
  if (!isMounted()) return <p>Loading...</p>

  return (
    <main className={styles.main}>
      {/* Wallet */}
      <div className={styles.header}>Your wallet</div>
      <div className={styles.subheader}>
        Your address is linked to jackqack.eth ENS profile. You can switch to another available ENS
        below.
      </div>
      <div className={styles.address}>{address ? formatAddress(address, 4) : null}</div>
      <div className={styles.primary} onClick={() => alert('ты лох')}>
        <CheckFilled className={styles.primarySuccess} fillColor={'var(--color-success)'} />
        <div className={styles.primaryDomain}>jackqack.eth</div>
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

      <div className={styles.profileInfo}>
        <Avatar {...{ chainId, address }} />
        <div>
          <div className={styles.profileDomain}>jackqack.eth</div>
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
        {networkFee && (
          <div className={styles.txFee}>
            <div className={styles.txFeeLabel}>
              <Gas />
              Network fee
            </div>
            <div className={styles.txFeeValue} title={gasLimit && `${gasLimit} gas`}>
              {formatNetworkFee(networkFee)}
            </div>
          </div>
        )}
      </form>
    </main>
  )
}

export default Profile
