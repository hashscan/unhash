import { BigNumber, PopulatedTransaction } from 'ethers'
import { RegistrationStep } from 'lib/types'
import { useLocalStorage } from 'usehooks-ts'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendRegister = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: { ...tx } as PopulatedTransaction & { to: string }
  })
  const [_, setRegTx] = useLocalStorage('reg-tx', '')

  const { sendTransaction, data } = useSendTransaction(config)

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setRegTx(data.transactionHash)
      localStorage.removeItem('step')
    }
  })

  return { data, isError, isLoading, sendTransaction, config, isSuccess }
}
