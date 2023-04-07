import { BigNumber } from 'ethers'
import {
  ETH_REGISTRAR_ADDRESS,
  ETH_REGISTRAR_ABI,
  YEAR_IN_SECONDS,
  ETH_RESOLVER_ADDRESS
} from 'lib/constants'
import { toNetwork } from 'lib/types'
import { getDomainName, loadingToStatus } from 'lib/utils'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useDomainPrice } from './useDomainPrice'
import { useRegistration } from './useRegistration'
import type { useSendRegistersType } from './useSendRegisters'

export const useSendRegister: useSendRegistersType = () => {
  const chainId = useChainId()
  const { registration, setRegistering } = useRegistration()

  if (!registration) throw new Error('registration should exist')

  // Docs suggests to pay 5% premium because oracle price may vary. Extra ETH gets refunded.
  // Let's try without extra ETH first as tx is sent right after price is fetched.
  // https://docs.ens.domains/contract-api-reference/.eth-permanent-registrar/controller#register-name
  const price = useDomainPrice(registration.names[0], registration?.duration)?.wei
  const value = price ? BigNumber.from(price) : undefined

  // Note 1: 280K gas is not enough to refund extra ETH sent to registerWithConfig
  // Note 2: 280K gas may not be enough if registering for another account
  // TODO: make sure fixed gas limit always works
  const gasLimit = 500_000

  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'registerWithConfig',
    args: [
      getDomainName(registration.names[0]),
      registration?.owner,
      registration?.duration || YEAR_IN_SECONDS,
      registration?.secret,
      ETH_RESOLVER_ADDRESS.get(toNetwork(chainId)),
      registration?.owner
    ],
    enabled: Boolean(registration?.secret) && Boolean(registration?.owner) && Boolean(value),
    overrides: {
      gasLimit: BigNumber.from(gasLimit),
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
    hash: data?.hash
    // // update registration status when transaction is confirmed
    // onSuccess: () => setRegistered()
  })

  return {
    gasLimit: config?.request?.gasLimit,
    write,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    error: sendError || waitError
  }
}
