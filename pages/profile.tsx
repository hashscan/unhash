import { ProgressBar } from 'components/icons'
import api, { DomainInfo, UserInfo } from 'lib/api'
import { useEffect, useState } from 'react'
import { Address, useAccount, useChainId, useEnsAvatar, useFeeData } from 'wagmi'
import ui from 'styles/ui.module.css'
import styles from './profile.module.css'
import { Domain, Fields, toNetwork } from 'lib/types'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'
import { useIsMounted } from 'usehooks-ts'
import { formatAddress } from 'lib/utils'

const Avatar = ({ chainId, address }: { chainId: number; address?: Address }) => {
  const { data: avatar, isLoading, error } = useEnsAvatar({ chainId, address })

  if (isLoading) return <>Loading...</>
  if (error) return <div className={ui.error}>{error?.message}</div>
  return <img className={styles.avatar} src={avatar!} alt="ENS Avatar" />
}

const Profile = () => {
  const { address, isDisconnected } = useAccount()
  const chainId = useChainId()
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [fields, setFields] = useState<Fields>({})
  const [domain, setDomain] = useState<Domain | null>(null)

  const {
    isLoading: isFieldsLoading,
    write,
    writeError,
    remoteError,
    isRemoteError,
    isWriteError,
    config
  } = useSendSetFields({ domain, fields })
  const { data: feeData } = useFeeData()
  const txPrice = useTxPrice({ config, feeData })
  const isMounted = useIsMounted()

  useEffect(() => {
    if (address) {
      api.userInfo(address, toNetwork(chainId)).then((res) => {
        setUserInfo(res)
        setDomain(res.primaryEns!)
        if (res.primaryEns)
          api.domainInfo(res.primaryEns!, toNetwork(chainId)).then((res) => {
            setDomainInfo(res)
          })
      })
    }
  }, [chainId, address])

  const { isLoading: isPrimaryEnsLoading, write: setPrimaryEns } = useSetPrimaryEns({ domain })

  if (isDisconnected) return <p>Please connect wallet</p>

  return (
    <main className={styles.main}>
      {isMounted() ? (
        <>
          <Avatar {...{ chainId, address }} />
          <h1 className={styles.domain}>{formatAddress(address!)}</h1>
        </>
      ) : null}
      <div className={styles.domains}>
        {userInfo ? (
          <select
            className={ui.select}
            defaultValue={userInfo?.primaryEns || userInfo?.domains.resolved[0]}
          >
            {userInfo?.domains.resolved.map((domain) => (
              <option key={domain}>{domain}</option>
            ))}
          </select>
        ) : null}
        <button className={ui.button} onClick={() => setPrimaryEns?.()}>
          {isPrimaryEnsLoading ? <ProgressBar color="white" /> : 'Set as primary'}{' '}
        </button>
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
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
        }}
      >
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            className={`${ui.input} ${styles.desc}`}
            defaultValue={domainInfo?.records.name}
            placeholder="name"
            name="name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <input
            className={`${ui.input} ${styles.desc}`}
            defaultValue={domainInfo?.records.description}
            placeholder="description"
            name="description"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            className={`${ui.input} ${styles.desc}`}
            defaultValue={domainInfo?.records.email}
            placeholder="email"
            type="email"
            name="email"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="url">Website URL</label>
          <input
            className={`${ui.input} ${styles.desc}`}
            defaultValue={domainInfo?.records.url}
            placeholder="https://example.com"
            type="url"
            name="url"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="url">Twitter username</label>
          <input
            className={`${ui.input} ${styles.desc}`}
            defaultValue={domainInfo?.records['com.twitter']}
            placeholder="test_420"
            name="com.twitter"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="url">GitHub username</label>
          <input
            className={`${ui.input} ${styles.desc}`}
            defaultValue={domainInfo?.records['com.github']}
            placeholder="test_420"
            name="com.github"
          />
        </div>
        <button type="submit" className={ui.button}>
          Submit
        </button>
      </form>
    </main>
  )
}

export default Profile
