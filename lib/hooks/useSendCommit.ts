import { BigNumber, PopulatedTransaction } from 'ethers'
import { RegistrationStep } from 'lib/types'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'usehooks-ts'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendCommit = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: { ...tx } as PopulatedTransaction & { to: string }
  })
  const [_, setCommitTx] = useLocalStorage('commit-tx', '')
  const [__, setStep] = useLocalStorage('step', '')

  const { sendTransaction, data, error: sendError, isError: isSendError } = useSendTransaction(config)

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setCommitTx(data.transactionHash)
      setStep('wait' as RegistrationStep)
    }
  })

  return { data, isLoading, sendTransaction, config, isSuccess, sendError, remoteError, isSendError, isRemoteError }
}
