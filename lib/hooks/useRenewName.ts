import { BigNumber } from 'ethers'
import { ETH_REGISTRAR_ADDRESS, ETH_REGISTRAR_ABI } from 'lib/constants'
import { Domain, currentNetwork } from 'lib/types'
import { getDomainName, loadingToStatus } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useDomainPrice } from './useDomainPrice'

export const useRenewName = ({
  domain,
  duration,
  onError,
  onSuccess
}: {
  domain: Domain
  duration: number
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  // Docs suggests to pay 5% premium because oracle price may vary. Extra ETH gets refunded.
  // https://docs.ens.domains/contract-api-reference/.eth-permanent-registrar/controller#register-name
  const price = useDomainPrice(domain, duration)?.wei
  const value = price ? BigNumber.from(price) : undefined

  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(currentNetwork()),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'renew',
    args: [getDomainName(domain), duration],
    enabled: Boolean(value),
    overrides: {
      value: value
    }
  })

  const { write, data, isLoading: isWriteLoading } = useContractWrite({ ...config, onError })

  const { isLoading: isWaitLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess,
    onError
  })

  return {
    data,
    txHash: data?.hash,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    write,
    gasLimit: config.request?.gasLimit,
    isSuccess
  }
}
