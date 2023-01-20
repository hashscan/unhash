import { BigNumber, ethers } from 'ethers'
import { ETH_REGISTRAR_ADDRESS, ETH_REGISTRAR_ABI, YEAR_IN_SECONDS, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { toNetwork } from 'lib/types'
import { useChainId, usePrepareContractWrite, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useCommitSecret, useRegisterDuration, useRegisterStatus, useRegistration } from './storage'

export const useSendRegister = ({ name, owner }: { name: string; owner: string }) => {
  const { duration } = useRegisterDuration()
  const { secret } = useCommitSecret()
  const chainId = useChainId()
  const { registration, setRegistration } = useRegistration(name)
  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'registerWithConfig',
    args: [name, owner, duration || YEAR_IN_SECONDS, secret, ETH_RESOLVER_ADDRESS, owner],
    enabled: Boolean(secret),
    overrides: {
      gasLimit: BigNumber.from(100_000),
      value: ethers.utils.parseEther('0.1') // TODO: set correct price from api
    }
  })
  const { setStatus } = useRegisterStatus()

  const {
    sendTransaction,
    data,
    error: sendError,
    isError: isSendError
  } = useSendTransaction({
    ...config,
    onSuccess: (data) => {
      if (!registration) return

      setRegistration({ ...registration, registerTxHash: data.hash, status: 'registerPending' })
    }
  })

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      if (!registration) return
      setRegistration({ ...registration, status: 'registered' })
      setStatus('registered')
    }
  })

  return { data, isLoading, sendTransaction, config, isSuccess, sendError, remoteError, isSendError, isRemoteError }
}
