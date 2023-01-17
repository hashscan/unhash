import { BigNumber, PopulatedTransaction } from 'ethers'
import { RegistrationStep } from 'lib/types'
import { useRouter } from 'next/router'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendCommit = (tx: PopulatedTransaction | undefined) => {
  const { config } = usePrepareSendTransaction({
    request: { ...tx, gasLimit: BigNumber.from(46_000) } as PopulatedTransaction & { to: string }
  })
  const router = useRouter()

  const { sendTransaction, data } = useSendTransaction(config)

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      localStorage.setItem('commit-tx', data.transactionHash)
      localStorage.setItem('step', 'wait' as RegistrationStep)
      setTimeout(() => {
        router.replace({
          query: { ...router.query, step: 'wait' }
        })
      }, 1000)
    }
  })

  return { data, isError, isLoading, sendTransaction, config, isSuccess }
}
