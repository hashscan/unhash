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
import { formatNetworkFee, formatUSDPrice } from 'lib/format'

const Avatar = ({ chainId, address }: { chainId: number; address?: Address }) => {
  const { data: avatar, isLoading, error } = useEnsAvatar({ chainId, address })

  if (isLoading) return <>Loading...</>
  if (error) return <div className={ui.error}>{error?.message}</div>
  return <img className={styles.avatar} src={avatar!} alt="ENS Avatar" />
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
        className={`${ui.input} ${styles.desc}`}
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

  return (
    <main className={styles.main}>
      {isMounted() ? (
        <>
          <Avatar {...{ chainId, address }} />
          <h1 className={styles.domain}>{address ? formatAddress(address) : null}</h1>
        </>
      ) : null}
      <div className={styles.domains}>
        {userInfo ? (
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
        ) : null}
        <button
          className={`${ui.button} ${styles.primaryButton}`}
          onClick={() => {
            setPrimaryEns?.()
          }}
        >
          {isPrimaryEnsLoading ? <ProgressBar color="white" /> : 'Set as primary'}{' '}
        </button>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <Input {...{ fields }} name="name" label="Name" placeholder="ens_user" />
        <Input
          {...{ fields }}
          name="description"
          label="Description"
          placeholder="23 y.o. designer from Moscow"
        />
        <Input {...{ fields }} label="Email" placeholder="email" type="email" name="email" />
        <Input
          {...{ fields }}
          label="Website URL"
          placeholder="https://example.com"
          type="url"
          name="url"
        />
        <Input {...{ fields }} placeholder="test_420" name="com.twitter" label="Twitter username" />
        <Input {...{ fields }} placeholder="test_420" name="com.github" label="GitHub username" />

        {error && <div className={ui.error}>{error.message}</div>}

        <button type="submit" disabled={isLoading} className={ui.button}>
          {isLoading ? <ProgressBar color="white" /> : 'Submit'}
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
