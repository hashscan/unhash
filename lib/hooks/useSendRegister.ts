import { ethers } from 'ethers'
import {
  ETH_REGISTRAR_ADDRESS,
  ETH_REGISTRAR_ABI,
  YEAR_IN_SECONDS,
  GOERLI_REGISTRAR_ADDRESS,
  ETH_RESOLVER_ADDRESS
} from 'lib/constants'
import { useChainId, usePrepareContractWrite, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useCommitSecret, useRegisterDuration, useRegisterStep } from './storage'

export const useSendRegister = ({ name, owner }: { name: string; owner: string }) => {
  const { duration } = useRegisterDuration()
  const { secret } = useCommitSecret()
  const chainId = useChainId()
  const { config } = usePrepareContractWrite({
    address: chainId === 1 ? ETH_REGISTRAR_ADDRESS : GOERLI_REGISTRAR_ADDRESS,
    abi: ETH_REGISTRAR_ABI,
    functionName: 'registerWithConfig',
    args: [name, owner, duration || YEAR_IN_SECONDS, secret, ETH_RESOLVER_ADDRESS, owner],
    overrides: { value: ethers.utils.parseEther('0.1') }
  })
  const { setStep } = useRegisterStep()
  const { sendTransaction, data, error: sendError, isError: isSendError } = useSendTransaction(config)

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      setStep('success')
    }
  })

  return { data, isLoading, sendTransaction, config, isSuccess, sendError, remoteError, isSendError, isRemoteError }
}
