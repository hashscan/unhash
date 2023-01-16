import { BigNumber, PopulatedTransaction } from 'ethers'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendCommit = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: { ...tx, gasLimit: BigNumber.from(60_000) } as PopulatedTransaction & { to: string }
  })

  const { sendTransaction, data, error } = useSendTransaction(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  })

  return { data, error, isLoading, sendTransaction, config, isSuccess }
}
