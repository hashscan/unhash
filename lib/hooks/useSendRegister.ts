import { BigNumber, ethers } from 'ethers'
import { ETH_REGISTRAR_ADDRESS, ETH_REGISTRAR_ABI, YEAR_IN_SECONDS, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { toNetwork } from 'lib/types'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRegisterStatus, useRegistration } from './storage'

export const useSendRegister = ({ name }: { name: string }) => {
  const chainId = useChainId()
  const { registration, setRegistration } = useRegistration(name)

  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'registerWithConfig', // 'registerWithConfig' does not work
    args: [
      name,
      registration?.owner,
      registration?.duration || YEAR_IN_SECONDS,
      registration?.secret,
      ETH_RESOLVER_ADDRESS.get(toNetwork(chainId)),
      registration?.owner
    ],
    enabled: Boolean(registration?.secret) && Boolean(registration?.owner),
    overrides: {
      gasLimit: BigNumber.from(500_000),
      value: ethers.utils.parseEther('0.1') // TODO: set correct price from api
    }
  })
  const { setStatus } = useRegisterStatus()

  const {
    write,
    data,
    error: sendError,
    isError: isSendError
  } = useContractWrite({
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

  return { data, isLoading, write, config, isSuccess, sendError, remoteError, isSendError, isRemoteError }
}
