import { ProgressBar } from 'components/icons'
import api, { DomainInfo } from 'lib/api'
import { useEffect, useState } from 'react'
import { goerli, useAccount, useChainId, useEnsName, useFeeData } from 'wagmi'
import ui from 'styles/ui.module.css'
import form from 'styles/CommitmentForm.module.css'
import styles from 'styles/profile.module.css'
import { Fields, toNetwork } from 'lib/types'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import { useTxPrice } from 'lib/hooks/useTxPrice'

const Profile = () => {
  const { address, isDisconnected } = useAccount()
  const chainId = useChainId()
  const { data: domain, error, isError, isLoading } = useEnsName({ address, chainId })
  const [info, setInfo] = useState<DomainInfo | null>(null)
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  const [fields, setFields] = useState<Fields>({})

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
    if (domain) {
      api.domainInfo(domain, toNetwork(chainId)).then((res) => setInfo(res))
    }
  }, [chainId, domain, mode])

  if (isDisconnected) return 'Connect Wallet'
  if (isError) return <div className={ui.error}>{error?.message}</div>
  if (isLoading) return <ProgressBar />

  return (
    <main className={styles.main}>
      <h1>{domain}</h1>
      <button className={ui.button} onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>
        {mode === 'view' ? 'edit' : 'view'}
      </button>
      {info ? (
        mode === 'view' ? (
          <div>
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
              className={form.form}
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
              <div className={form.field}>
                <label htmlFor="name">Name</label>
                <input name="name" placeholder="ens_user420" defaultValue={info.records.name} className={ui.input} />
              </div>
              <div className={form.field}>
                <label htmlFor="description">Bio</label>
                <input
                  name="description"
                  placeholder="23 yo designer from Moscow"
                  className={ui.input}
                  defaultValue={info.records.description}
                />
              </div>
              <div className={form.field}>
                <label htmlFor="url">Website URL</label>
                <input
                  name="url"
                  placeholder="https://example.com"
                  minLength={3}
                  defaultValue={info.records.url}
                  className={ui.input}
                />
              </div>
              <div className={form.field}>
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  placeholder="hello@example.com"
                  minLength={5}
                  className={ui.input}
                  defaultValue={info.records.email}
                />
              </div>
              <div className={form.field}>
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
