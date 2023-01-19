import { useEffect } from 'react'
import { useChainId, useContractRead, useFeeData } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import styles from 'styles/CommitmentForm.module.css'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import { useLocalStorage } from 'usehooks-ts'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, GOERLI_REGISTRAR_ADDRESS, YEAR_IN_SECONDS } from 'lib/constants'

import { useCommitSecret, useRegisterDuration } from 'lib/hooks/storage'
import { randomSecret } from 'lib/utils'

const generatedSecret = randomSecret()

export const CommitmentForm = ({
  name,
  feeData,
  accountAddress
}: {
  name: string
  feeData: ReturnType<typeof useFeeData>['data']
  accountAddress?: `0x${string}`
}) => {
  const [address, setAddress] = useLocalStorage('owner-address', accountAddress as string)
  const chainId = useChainId()
  const { secret, setSecret } = useCommitSecret(generatedSecret)
  const { setDuration } = useRegisterDuration()

  const { data: commitmentHash } = useContractRead<string[], 'makeCommitment', string>({
    abi: ETH_REGISTRAR_ABI,
    address: chainId === 1 ? ETH_REGISTRAR_ADDRESS : GOERLI_REGISTRAR_ADDRESS,
    functionName: 'makeCommitment',
    args: [name, address, secret]
  })

  const { config, write, isLoading, isSuccess, isWriteError, isRemoteError, remoteError, writeError } = useSendCommit({
    commitmentHash,
    chainId
  })

  const txPrice = useTxPrice({ config, feeData })

  useEffect(() => {
    setSecret(generatedSecret)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        if (e.currentTarget.reportValidity()) {
          write?.()
        }
      }}
    >
      <div className={styles.field}>
        <label htmlFor="address">Owner: </label>
        <input
          name="owner"
          value={address}
          required
          pattern="^0x[a-fA-F0-9]{40}$"
          onChange={(v) => setAddress(v.currentTarget.value as `0x${string}`)}
          defaultValue={accountAddress}
          className={ui.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="duration">Duration (years): </label>
        <input
          required
          name="duration (years)"
          placeholder="1"
          type="number"
          min={1}
          defaultValue={1}
          className={ui.input}
          onChange={(v) => {
            const n = v.currentTarget.valueAsNumber
            if (!isNaN(n)) setDuration(n * YEAR_IN_SECONDS)
          }}
        />
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
