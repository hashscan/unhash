import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, GOERLI_REGISTRAR_ADDRESS } from 'lib/constants'
import { RegistrationStep } from 'lib/types'
import { useLocalStorage } from 'usehooks-ts'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSendCommit = ({ commitmentHash, chainId }: { commitmentHash?: string; chainId: number }) => {
  const { config } = usePrepareContractWrite({
    address: chainId === 1 ? ETH_REGISTRAR_ADDRESS : GOERLI_REGISTRAR_ADDRESS,
    abi: ETH_REGISTRAR_ABI,
    functionName: 'commit',
    args: [commitmentHash]
  })
  const [_, setCommitTxBlock] = useLocalStorage('commit-tx-block', 0)
  const [__, setStep] = useLocalStorage('step', '')

  const { write, data, error: writeError, isError: isWriteError } = useContractWrite(config)

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async (data) => {
      setCommitTxBlock(data.blockNumber)
      setStep('wait' as RegistrationStep)
    }
  })

  return { data, isLoading, write, config, isSuccess, writeError, remoteError, isWriteError, isRemoteError }
}
