import { BigNumber, ethers, PopulatedTransaction } from 'ethers'
import { ENS } from '@ensdomains/ensjs'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, useFeeData, useSigner } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import styles from 'styles/CommitmentForm.module.css'
import { useSendCommit } from 'hooks/useSendCommit'
import type { providers } from 'ethers'
import { useLocalStorage } from 'usehooks-ts'

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
  provider: providers.BaseProvider
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

  const txPrice = useMemo(
    () =>
      config.request
        ? (
            parseFloat(
              ethers.utils.formatEther(
                BigNumber.from(config.request.gasLimit).mul(
                  feeData!.lastBaseFeePerGas!.add(feeData?.maxPriorityFeePerGas!)
                )
              )
            ) * ethPrice
          ).toPrecision(5)
        : '',
    [feeData, config]
  )

  useEffect(() => {
    // get tx data for commitment
    const fn = async () => {
      const { customData, ...commitPopTx } = await ens
        .withProvider(provider as ethers.providers.JsonRpcProvider)
        .commitName.populateTransaction(domain, {
          duration: duration * 31536000,
          owner: address,
          addressOrIndex: address,
          signer: signer as ethers.providers.JsonRpcSigner
        })

      const { secret, wrapperExpiry } = customData!
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
