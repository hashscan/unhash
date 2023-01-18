import { ENS } from '@ensdomains/ensjs'
import { useEffect, useState } from 'react'
import { useFeeData, useSigner } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import styles from 'styles/CommitmentForm.module.css'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import type { providers, PopulatedTransaction } from 'ethers'
import { useLocalStorage } from 'usehooks-ts'
import { commitName } from 'lib/ens/commitName'
import { useTxPrice } from 'lib/hooks/useTxPrice'

export const CommitmentForm = ({
  domain,

  feeData,
  ethPrice,
  provider,
  signer,
  ens,
  accountAddress
}: {
  domain: string
  feeData: ReturnType<typeof useFeeData>['data']
  ethPrice: number
  provider: providers.JsonRpcProvider
  signer?: ReturnType<typeof useSigner>['data']
  ens: ENS
  accountAddress?: `0x${string}`
}) => {
  const [commitTx, setCommitTx] = useState<PopulatedTransaction>()

  const [address, setAddress] = useLocalStorage('owner-address', accountAddress as string)

  const { config, sendTransaction, isError, isLoading, isSuccess } = useSendCommit(commitTx)

  const [_, setSecret] = useLocalStorage('commit-secret', '')
  const [__, setCommitWrapperExpiry] = useLocalStorage('commit-wrapper-expiry', '')
  const [duration, setDuration] = useLocalStorage('duration', 31536000)

  const txPrice = useTxPrice({ config, feeData })

  useEffect(() => {
    // get tx data for commitment
    const fn = async () => {
      const { secret, wrapperExpiry, commitPopTx } = await commitName({
        provider,
        address,
        ens,
        signer: signer as providers.JsonRpcSigner,
        domain,
        duration
      })
      setSecret(secret)
      setCommitWrapperExpiry((wrapperExpiry as BigInt).toString())

      setCommitTx(commitPopTx)
    }
    if (address && duration) fn()
  }, [address, duration])

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        if (e.currentTarget.reportValidity()) {
          sendTransaction?.()
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
            if (!isNaN(n)) setDuration(n)
          }}
        />
      </div>
      <button type="submit" className={ui.button}>
        {isLoading ? <ProgressBar /> : 'Commit'}
      </button>
      {isSuccess && 'success!'}
      {isError && 'tx error :('}
      {txPrice && <>commit tx cost: ${txPrice}</>}
    </form>
  )
}
