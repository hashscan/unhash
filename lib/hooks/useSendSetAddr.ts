import { ETH_RESOLVER_ABI } from 'lib/constants'
import { getNodeForResolver } from 'lib/ensUtils'
import { Domain } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

const COIN_TYPE_ETH = 60

/**
 * Updates ETH address for a domain.
 */
export const useSendSetAddr = ({
  domain,
  resolver,
  address,
  onError,
  onSuccess
}: {
  domain: Domain
  resolver?: string
  address?: Address
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const node = resolver ? getNodeForResolver(domain) : undefined

  const { config } = usePrepareContractWrite({
    address: resolver as `0x${string}` | undefined,
    abi: ETH_RESOLVER_ABI,
    functionName: 'setAddr',
    enabled: Boolean(resolver) && Boolean(node) && Boolean(address),
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
