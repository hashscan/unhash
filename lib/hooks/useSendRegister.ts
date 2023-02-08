import { BigNumber } from 'ethers'
import {
  ETH_REGISTRAR_ADDRESS,
  ETH_REGISTRAR_ABI,
  YEAR_IN_SECONDS,
  ETH_RESOLVER_ADDRESS,
  REGISTER_GAS_LIMIT
} from 'lib/constants'
import { toNetwork } from 'lib/types'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useDomainPrice } from './useDomainPrice'
import { useRegistration } from './useRegistration'

export const useSendRegister = (name: string) => {
  const chainId = useChainId()
  const { registration, setRegistering, setRegistered } = useRegistration(name)

  // Docs suggests to pay 5% premium because oracle price may vary. Extra ETH gets refunded.
  // Let's try without extra ETH first as tx is sent right after price is fetched.
  // https://docs.ens.domains/contract-api-reference/.eth-permanent-registrar/controller#register-name

  // TODO: pass domain instead of name
  const price = useDomainPrice(`${name}.eth`, registration?.duration)?.wei
  const value = price ? BigNumber.from(price) : undefined

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
    enabled: Boolean(registration?.secret) && Boolean(registration?.owner) && Boolean(value),
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

  const { isLoading: isWaitLoading, error: waitError } = useWaitForTransaction({
    hash: data?.hash,
    // update registration status when transaction is confirmed
    onSuccess: () => setRegistered()
  })

  return {
    gasLimit: config?.request?.gasLimit,
    write,
    isLoading: isWriteLoading || isWaitLoading,
    error: sendError || waitError
  }
}
