import { ProgressBar } from 'components/icons'
import api, { DomainInfo, UserInfo } from 'lib/api'
import { useEffect, useState } from 'react'
import { goerli, useAccount, useChainId, useFeeData } from 'wagmi'
import ui from 'styles/ui.module.css'
import styles from 'styles/profile.module.css'
import { Domain, Fields, toNetwork } from 'lib/types'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'

const EnsToggle = ({ domain }: { domain: Domain }) => {
  const { isLoading, write } = useSetPrimaryEns({ domain })

  return (
    <button
      disabled={isLoading}
      className={ui.buttonSecondary}
      onClick={() => {
        write?.()
      }}
    >
      {isLoading ? <ProgressBar height={16} width={16} /> : domain}
    </button>
  )
}

const Profile = () => {
  const { address, isDisconnected } = useAccount()
  const chainId = useChainId()
  const [info, setInfo] = useState<DomainInfo | null>(null)
  const [mode, setMode] = useState<'view' | 'edit'>('view')
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
  } = useSendSetFields({ domain, fields, onSuccess: () => setMode('view') })
  const { data: feeData } = useFeeData()
  const txPrice = useTxPrice({ config, feeData })

  useEffect(() => {
    if (address) {
      api.userInfo(address, toNetwork(chainId)).then((res) => {
        setUserInfo(res)
        setDomain(res.primaryEns!)
        if (res.primaryEns)
          api.domainInfo(res.primaryEns!, toNetwork(chainId)).then((res) => {
            setInfo(res)
          })
      })
    }
  }, [chainId, mode, address])

  if (isDisconnected) return 'Connect Wallet'

  return (
    <main className={styles.main}>
      <h1>{domain}</h1>
      <button className={ui.button} onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>
        {mode === 'view' ? 'edit' : 'view'}
      </button>
      {info ? (
        mode === 'view' ? (
          <div>
            <div className={styles.domains}>
              {userInfo?.domains.resolved.map((domain) => (
                <EnsToggle {...{ domain }} key={domain} />
              ))}
            </div>
            <h2>Records</h2>
            {Object.entries(info.records).map(([k, v]) => {
              return v ? (
                <div key={`${k}-${v}`}>
                  <span>{k}</span> - <span>{v}</span>
                </div>
              ) : null
            })}
            {chainId !== goerli.id && (
              <>
                <h2>Misc</h2>
                <div>Controller: {info.controller}</div>
                <div>Registrant: {info.registrant}</div>
                <div>Resolver: {info.resolver}</div>
              </>
            )}
          </div>
        ) : (
          <>
            <h2>Records</h2>
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
                <input name="name" placeholder="ens_user420" defaultValue={info.records.name} className={ui.input} />
              </div>
              <div className={styles.field}>
                <label htmlFor="description">Bio</label>
                <input
                  name="description"
                  placeholder="23 yo designer from Moscow"
                  className={ui.input}
                  defaultValue={info.records.description}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="url">Website URL</label>
                <input
                  name="url"
                  placeholder="https://example.com"
                  minLength={3}
                  defaultValue={info.records.url}
                  className={ui.input}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  placeholder="hello@example.com"
                  minLength={5}
                  className={ui.input}
                  defaultValue={info.records.email}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="com.twitter">Twitter handle</label>
                <input
                  name="com.twitter"
                  placeholder="jake"
                  className={ui.input}
                  defaultValue={info.records['com.twitter']}
                />
              </div>
              {/* <div className={form.field}>
                <label htmlFor="com.github">GitHub username</label>
                <input
                  name="com.github"
                  placeholder="ry"
                  className={ui.input}
                  defaultValue={info.records['com.github']}
                />
              </div>
              <div className={form.field}>
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  name="avatar"
                  placeholder="ipfs://ba..."
                  minLength={4}
                  className={ui.input}
                  defaultValue={info.records.avatar}
                />
              </div> */}

              <button disabled={isFieldsLoading} type="submit" className={ui.button}>
                {isFieldsLoading ? <ProgressBar /> : 'Submit'}
              </button>
              {txPrice && <>commit tx cost: ${txPrice}</>}
              <div>
                {isWriteError && <div className={ui.error}>{writeError?.message}</div>}
                {isRemoteError && <div className={ui.error}>{remoteError?.message}</div>}
              </div>
            </form>
          </>
        )
      ) : (
        'No info / Loading'
      )}
    </main>
  )
}

export default Profile
