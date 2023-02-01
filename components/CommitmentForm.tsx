import { useState } from 'react'
import { Address, useChainId, useContractRead } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import styles from 'styles/CommitmentForm.module.css'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import { useLocalStorage } from 'usehooks-ts'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, ETH_RESOLVER_ADDRESS, YEAR_IN_SECONDS } from 'lib/constants'

import { Fields, toNetwork } from 'lib/types'
import { randomSecret } from 'lib/utils'
import { providers } from 'ethers'

const secret = randomSecret()
export const CommitmentForm = ({
  name,
  feeData,
  accountAddress
}: {
  name: string
  feeData?: providers.FeeData
  accountAddress?: Address
}) => {
  const chainId = useChainId()
  const [address, setAddress] = useLocalStorage('owner-address', accountAddress as string)

  const [duration, setDuration] = useState(YEAR_IN_SECONDS)
  // TODO: move to service / create a hook
  const { data: commitmentHash } = useContractRead<string[], 'makeCommitmentWithConfig', string>({
    abi: ETH_REGISTRAR_ABI,
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    functionName: 'makeCommitmentWithConfig',
    args: [name, address, secret, ETH_RESOLVER_ADDRESS.get(toNetwork(chainId)), address]
  })

  const [fields, setFields] = useState<Fields>({})

  const { config, write, isLoading, isSuccess, isWriteError, isRemoteError, remoteError, writeError } = useSendCommit({
    commitmentHash,
    chainId,
    owner: address,
    name,
    duration,
    secret,
    fields
  })

  const txPrice = useTxPrice({ config, feeData })

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        if (typeof write !== 'undefined' && e.currentTarget.reportValidity()) {
          const fd = new FormData(e.currentTarget)
          const f: Fields = {}

          for (const [k, v] of fd.entries()) {
            if (k === 'owner') {
              setAddress(v as string)
            } else if (k === 'duration') {
              setDuration(parseInt(v as string) * YEAR_IN_SECONDS)
            } else {
              f[k] = v as string
            }
          }

          setFields(f)

          write()
        }
      }}
    >
      <div className={styles.field}>
        <label htmlFor="owner">Owner</label>
        <input name="owner" required pattern="^0x[a-fA-F0-9]{40}$" defaultValue={accountAddress} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="duration">Duration (years)</label>
        <input required name="duration" placeholder="1" type="number" min={1} defaultValue={1} className={ui.input} />
      </div>
      <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '30px', marginBottom: '10px' }}>Profile</div>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input name="name" placeholder="ens_user420" className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="description">Bio</label>
        <input name="description" placeholder="23 yo designer from Moscow" className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="url">Website URL</label>
        <input name="url" placeholder="https://example.com" minLength={3} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input name="email" placeholder="hello@example.com" minLength={5} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="com.twitter">Twitter handle</label>
        <input name="com.twitter" placeholder="jake" className={ui.input} />
      </div>
      {/* <div className={styles.field}>
        <label htmlFor="com.github">GitHub username</label>
        <input name="com.github" placeholder="ry" className={ui.input} />
      </div> */}
      {/* <div className={styles.field}>
        <label htmlFor="avatar">Avatar URL</label>
        <input name="avatar" placeholder="ipfs://ba..." minLength={4} className={ui.input} />
      </div> */}
      <button type="submit" className={ui.button} style={{ marginTop: '30px' }}>
        {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Commit'}
      </button>
      {txPrice && <>commit tx cost: ${txPrice}</>}
      <div>
        {isSuccess && 'success!'}
        {isWriteError && <div className={ui.error}>{writeError?.message}</div>}
        {isRemoteError && <div className={ui.error}>{remoteError?.message}</div>}
      </div>
    </form>
  )
}
