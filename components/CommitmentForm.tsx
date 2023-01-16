import { ethers, BigNumber, PopulatedTransaction } from 'ethers'
import { useENSInstance } from 'hooks/useENSInstance'
import { useEthPrice } from 'hooks/useEthPrice'
import { useSendCommit } from 'hooks/useSendCommit'
import { useEffect, useState } from 'react'
import { useAccount, useFeeData, useProvider, useSigner } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import styles from 'styles/CommitmentForm.module.css'

export const CommitmentForm = ({ domain }: { domain: string }) => {
  const ens = useENSInstance()
  const { data: signer } = useSigner()
  const provider = useProvider()
  const { data: feeData } = useFeeData()
  const ethPrice = useEthPrice()
  const [duration, setDuration] = useState(1)
  const { address: accountAddress } = useAccount()

  const [address, setAddress] = useState<string>(accountAddress as string)
  const [commitTx, setCommitTx] = useState<PopulatedTransaction>()

  const { config, sendTransaction, error, isLoading } = useSendCommit(commitTx)

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

      setCommitTx(commitPopTx)
    }
    if (address && duration) fn()
  }, [address, duration])

  return (
    <>
      <div className={styles.field}>
        <label htmlFor="address">Owner: </label>
        <input
          name="owner"
          value={address}
          pattern="^0x[a-fA-F0-9]{40}$"
          onChange={(v) => setAddress(v.currentTarget.value as `0x${string}`)}
          defaultValue={accountAddress}
          className={ui.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="duration">Duration (years): </label>
        <input
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
      <button
        className={ui.button}
        onClick={async () => {
          sendTransaction?.()
        }}
      >
        {isLoading ? <ProgressBar /> : 'Commit'}
      </button>
      {config.request && (
        <>
          commit tx cost: $
          {(
            parseFloat(
              ethers.utils.formatEther(
                BigNumber.from(config.request.gasLimit).mul(
                  feeData!.lastBaseFeePerGas!.add(feeData?.maxPriorityFeePerGas!)
                )
              )
            ) * ethPrice
          ).toPrecision(5)}
        </>
      )}
    </>
  )
}
