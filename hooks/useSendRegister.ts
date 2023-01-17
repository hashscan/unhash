import { BigNumber, PopulatedTransaction } from 'ethers'
import { RegistrationStep } from 'lib/types'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendRegister = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: { ...tx, gasLimit: BigNumber.from(280_000) } as PopulatedTransaction & { to: string }
  })

  const { sendTransaction, data } = useSendTransaction(config)

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      localStorage.setItem('reg-tx', data.transactionHash)
      localStorage.removeItem('step')
    }
  })

  return { data, isError, isLoading, sendTransaction, config, isSuccess }
}
