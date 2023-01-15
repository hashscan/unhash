import { PopulatedTransaction } from 'ethers'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export const useSendCommit = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: tx as PopulatedTransaction & { to: string }
  })

  const { sendTransaction, data, error, isLoading } = useSendTransaction(config)

  return { data, error, isLoading, sendTransaction, config }
}
