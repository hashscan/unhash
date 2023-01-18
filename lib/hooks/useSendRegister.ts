import { BigNumber, PopulatedTransaction } from 'ethers'
import { RegistrationStep } from 'lib/types'
import { useLocalStorage } from 'usehooks-ts'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendRegister = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: { ...tx, gasLimit: BigNumber.from(300_000) } as PopulatedTransaction & { to: string }
  })
  const [_, setRegTx] = useLocalStorage('reg-tx', '')

  const { sendTransaction, data, error: sendError, isError: isSendError } = useSendTransaction(config)

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setRegTx(data.transactionHash)
      localStorage.removeItem('step')
    }
  })

  return { data, isLoading, sendTransaction, config, isSuccess, sendError, remoteError, isSendError, isRemoteError }
}
