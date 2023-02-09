import { BigNumber, ethers } from 'ethers'
import { ETH_REGISTRAR_ADDRESS, ETH_REGISTRAR_ABI, YEAR_IN_SECONDS, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { toNetwork } from 'lib/types'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRegistration } from './useRegistration'

export const useSendRegister = (name: string) => {
  const chainId = useChainId()
  const { registration, setRegistering, setRegistered } = useRegistration(name)

  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'registerWithConfig',
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

  const {
    write,
    data,
    isLoading: isWriteLoading,
    error: sendError,
  } = useContractWrite({
    ...config,
    // update registration status when transaction is sent
    onSuccess: (data) => setRegistering(data.hash)
  })

  const {
    isLoading: isWaitLoading,
    isSuccess,
    error: waitError
  } = useWaitForTransaction({
    hash: data?.hash,
    // update registration status when transaction is confirmed
    onSuccess: () => setRegistered()
  })

  return {
    data,
    isLoading: isWriteLoading || isWaitLoading,
    write,
    config,
    isSuccess,
    error: sendError || waitError,
  }
}
