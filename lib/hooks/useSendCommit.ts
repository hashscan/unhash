import { BigNumber, PopulatedTransaction } from 'ethers'
import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS } from 'lib/constants'
import { RegistrationStep } from 'lib/types'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'usehooks-ts'
import { useContractWrite, usePrepareContractWrite, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendCommit = ({ commitmentHash }: { commitmentHash?: string }) => {
  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS,
    abi: ETH_REGISTRAR_ABI,
    functionName: 'commit',
    args: [commitmentHash]
  })
  const [_, setCommitTx] = useLocalStorage('commit-tx', '')
  const [__, setStep] = useLocalStorage('step', '')

  const { write, data, error: writeError, isError: isWriteError } = useContractWrite(config)

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

  return { data, isLoading, write, config, isSuccess, writeError, remoteError, isWriteError, isRemoteError }
}
