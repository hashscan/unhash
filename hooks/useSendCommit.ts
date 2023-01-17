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

  const { sendTransaction, data } = useSendTransaction(config)

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setCommitTx(data.transactionHash)
      setStep('wait' as RegistrationStep)
    }
  })

  return { data, isError, isLoading, sendTransaction, config, isSuccess }
}
