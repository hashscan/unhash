import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Domain, toNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import {
  Address,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'

const COIN_TYPE_ETH = 60

/**
 * Updates ETH address for a domain.
 */
export const useSendSetAddr = ({
  domain,
  address,
  onError,
  onSuccess
}: {
  domain: Domain
  address?: Address
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const chainId = useChainId()
  const node = domain ? namehash(domain) : undefined

  const { config } = usePrepareContractWrite({
    address: ETH_RESOLVER_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_RESOLVER_ABI,
    functionName: 'setAddr',
    enabled: Boolean(node) && Boolean(address),
    args: [node, COIN_TYPE_ETH, address?.toLowerCase()]
  })

  // hook for sending setAddr transaction
  const {
    write,
    data,
    isLoading: isWriteLoading,
    error: writeError
  } = useContractWrite({
    ...config,
    onError
  })

  // wait for transaction success
  const { isLoading: isWaitLoading, error: waitError } = useWaitForTransaction({
    hash: data?.hash,
    onError,
    onSuccess
  })

  return {
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    error: writeError || waitError,
    sendSetAddr: write,
    gasLimit: config.request?.gasLimit
  }
}
