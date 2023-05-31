import { ETH_RESOLVER_ABI } from 'lib/constants'
import { Domain, NFTToken } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { nftToAvatarRecord } from 'lib/utils'
import { getNodeForResolver } from 'lib/ensUtils'

const TEXT_AVATAR_FIELD = 'avatar'

/**
 * Updates `avatar` text record for a given domain
 */
export const useSendSetAvatar = ({
  domain,
  resolver,
  avatar,
  onError,
  onSuccess
}: {
  domain: Domain
  resolver?: string
  avatar: NFTToken | null
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const node = resolver ? getNodeForResolver(domain) : undefined

  const { config } = usePrepareContractWrite({
    address: resolver as `0x${string}` | undefined,
    abi: ETH_RESOLVER_ABI,
    functionName: 'setText',
    enabled: Boolean(node) && Boolean(resolver) && Boolean(avatar),
    args: [node, TEXT_AVATAR_FIELD, avatar ? nftToAvatarRecord(avatar) : null]
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
    sendSetAvatar: write,
    gasLimit: config.request?.gasLimit
  }
}
