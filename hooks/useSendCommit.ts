import { BigNumber, PopulatedTransaction } from 'ethers'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export const useSendCommit = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: { ...tx, gasLimit: BigNumber.from(60_000) } as PopulatedTransaction & { to: string }
  })

  const { sendTransaction, data, error, isLoading } = useSendTransaction(config)

  return { data, error, isLoading, sendTransaction, config }
}
