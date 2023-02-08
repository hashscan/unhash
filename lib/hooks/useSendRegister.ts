import { BigNumber, ethers } from 'ethers'
import {
  ETH_REGISTRAR_ADDRESS,
  ETH_REGISTRAR_ABI,
  YEAR_IN_SECONDS,
  ETH_RESOLVER_ADDRESS,
  REGISTER_GAS_LIMIT
} from 'lib/constants'
import { toNetwork } from 'lib/types'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRegistration } from './useRegistration'

export const useSendRegister = (name: string) => {
  const chainId = useChainId()
  const { registration, setRegistering, setRegistered } = useRegistration(name)

  // TODO: set based on domain price from api
  const value = ethers.utils.parseEther('0.1')

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
      gasLimit: BigNumber.from(REGISTER_GAS_LIMIT), // make sure fixed gas limit always works
      value: value
    }
  })

  const {
    write,
    data,
    isLoading: isWriteLoading,
    error: sendError
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
    gasLimit: config?.request?.gasLimit,
    data,
    isLoading: isWriteLoading || isWaitLoading,
    write,
    config,
    isSuccess,
    error: sendError || waitError
  }
}
