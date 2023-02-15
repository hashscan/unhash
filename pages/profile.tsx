/* eslint-disable @next/next/no-img-element */
import { Gas, ProgressBar } from 'components/icons'
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

const Avatar = ({ chainId, address }: { chainId: number; address?: Address }) => {
  // TODO: display avatar from selected domain not current wallet
  const { data: avatar } = useEnsAvatar({ chainId, address })

  return (
    <div className={styles.avatarWrapper}>
      {address && avatar && (
        <img className={styles.avatar} width={96} height={96} src={avatar} alt="" />
      )}
    </div>
  )
}

const Input: React.FC<
  JSX.IntrinsicElements['input'] & { name: string; fields: Fields | null; label: string }
> = ({ fields, name, label, ...props }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (fields) setValue(fields[name]!)
  }, [fields, name])

  return (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      <input
        {
          ...props /* see https://stackoverflow.com/a/49714237/11889402 */
        }
        className={clsx(ui.input, styles.input)}
        value={value}
        name={name}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  )
}

const Profile = () => {
  const { address, isDisconnected } = useAccount()
  const chainId = useChainId()

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
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
      {/* Header */}
      <Avatar {...{ chainId, address }} />
      <div className={styles.address}>{address ? formatAddress(address, 6) : null}</div>

      {/* Primary ENS select */}
      <div className={styles.domains}>
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
      </div>

      <div className={styles.divider}></div>

      {/* Profile fields */}
      <form className={styles.form} onSubmit={onSubmit}>
        <Input {...{ fields }} name="name" label="Name" placeholder="Mastodon" />
        <Input
          {...{ fields }}
          name="description"
          label="Bio"
          placeholder="Free and open-source social network"
        />
        <Input
          {...{ fields }}
          label="Website"
          placeholder="https://mastodon.social"
          type="url"
          name="url"
        />
        <Input {...{ fields }} placeholder="@mastodon" name="com.twitter" label="Twitter" />

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
