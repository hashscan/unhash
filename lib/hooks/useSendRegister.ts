import { BigNumber } from 'ethers'
import { YEAR_IN_SECONDS, ETH_REGISTRAR_ADDRESS, ETH_REGISTRAR_ABI } from 'lib/constants'
import { currentNetwork } from 'lib/types'
import { getDomainName, loadingToStatus } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useDomainPrice } from './useDomainPrice'
import { useRegistration } from './useRegistration'
import type { useSendRegisterBulkType } from './useSendRegisterBulk'
import { registerGasLimit } from 'lib/ensUtils'

export const useSendRegister: useSendRegisterBulkType = () => {
  const { registration, setRegistering } = useRegistration()

  if (!registration) throw new Error('registration should exist')

  // Docs suggests to pay 5% premium because oracle price may vary. Extra ETH gets refunded.
  // Let's try without extra ETH first as tx is sent right after price is fetched.
  // https://docs.ens.domains/contract-api-reference/.eth-permanent-registrar/controller#register-name
  const price = useDomainPrice(registration.names[0], registration?.duration)?.wei
  const value = price ? BigNumber.from(price) : undefined
  const gasLimit = registerGasLimit(1)

  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(currentNetwork()),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'register',
    args: [
      getDomainName(registration.names[0]),
      registration?.owner,
      registration?.duration || YEAR_IN_SECONDS,
      registration?.secret,
      registration?.resolver,
      registration?.data,
      registration?.reverseRecord,
      registration?.ownerControlledFuses
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
