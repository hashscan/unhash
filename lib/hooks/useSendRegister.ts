import { ethers } from 'ethers'
import {
  ETH_REGISTRAR_ADDRESS,
  ETH_REGISTRAR_ABI,
  YEAR_IN_SECONDS,
  ETH_RESOLVER_ADDRESS
} from 'lib/constants'
import { toNetwork } from 'lib/types'
import { useChainId, usePrepareContractWrite, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useCommitSecret, useRegisterDuration, useRegisterStep } from './storage'

export const useSendRegister = ({ name, owner }: { name: string; owner: string }) => {
  const { duration } = useRegisterDuration()
  const { secret } = useCommitSecret()
  const chainId = useChainId()
  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'registerWithConfig',
    args: [name, owner, duration || YEAR_IN_SECONDS, secret, ETH_RESOLVER_ADDRESS, owner],
    overrides: {
      value: ethers.utils.parseEther('0.1')  // TODO: set correct price from api
    }
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
