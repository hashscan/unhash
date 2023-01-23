import { useState } from 'react'
import { useChainId, useContractRead, useFeeData } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import styles from 'styles/CommitmentForm.module.css'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import { useLocalStorage } from 'usehooks-ts'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, YEAR_IN_SECONDS } from 'lib/constants'

import { toNetwork } from 'lib/types'
import { useRegistration } from 'lib/hooks/storage'
import { randomSecret } from 'lib/utils'

const secret = randomSecret()
export const CommitmentForm = ({
  name,
  feeData,
  accountAddress
}: {
  name: string
  feeData: ReturnType<typeof useFeeData>['data']
  accountAddress?: `0x${string}`
}) => {
  const chainId = useChainId()
  const [address, setAddress] = useLocalStorage('owner-address', accountAddress as string)

  const [duration, setDuration] = useState(YEAR_IN_SECONDS)
  // TODO: move to service / create a hook
  const { data: commitmentHash } = useContractRead<string[], 'makeCommitment', string>({
    abi: ETH_REGISTRAR_ABI,
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    functionName: 'makeCommitment',
    args: [name, address, secret]
  })

  const { config, write, isLoading, isSuccess, isWriteError, isRemoteError, remoteError, writeError } = useSendCommit({
    commitmentHash,
    chainId,
    owner: address,
    name,
    duration,
    secret
  })

  const txPrice = useTxPrice({ config, feeData })

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        if (typeof write !== 'undefined' && e.currentTarget.reportValidity()) {
          const fd = new FormData(e.currentTarget)
          setAddress(fd.get('owner') as string)
          setDuration(parseInt(fd.get('duration') as string) * YEAR_IN_SECONDS)
          write()
        }
      }}
    >
      <div className={styles.field}>
        <label htmlFor="owner">Owner: </label>
        <input name="owner" required pattern="^0x[a-fA-F0-9]{40}$" defaultValue={accountAddress} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="duration">Duration (years): </label>
        <input required name="duration" placeholder="1" type="number" min={1} defaultValue={1} className={ui.input} />
      </div>
      <div>Optional fields:</div>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input name="name" placeholder="ens_user420" minLength={1} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input name="email" placeholder="hello@example.com" minLength={5} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="url">Website URL</label>
        <input name="url" placeholder="https://example.com" minLength={3} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="bio">Bio</label>
        <input name="bio" placeholder="23 yo designer from Moscow" minLength={1} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="tw">Twitter handle</label>
        <input name="tw" placeholder="jake" minLength={1} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="gh">GitHub username</label>
        <input name="gh" placeholder="ry" minLength={1} className={ui.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="avatar">Avatar URL</label>
        <input name="avatar" placeholder="ipfs://ba..." minLength={4} className={ui.input} />
      </div>
      <button type="submit" className={ui.button}>
        {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Commit'}
      </button>
      {txPrice && <>commit tx cost: ${txPrice}</>}
      <div>
        {isSuccess && 'success!'}
        {isWriteError && <div className={styles.error}>{writeError?.message}</div>}
        {isRemoteError && <div className={styles.error}>{remoteError?.message}</div>}
      </div>
    </form>
  )
}
