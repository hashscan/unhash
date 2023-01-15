import { PopulatedTransaction } from 'ethers'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export const useSendCommit = (tx: PopulatedTransaction | undefined) => {
  const { config, data, error, isLoading } = usePrepareSendTransaction({
    request: tx as PopulatedTransaction & { to: string }
  })

  const { sendTransaction } = useSendTransaction(config)

  return { data, error, isLoading, sendTransaction }
}
