import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI, ETH_RESOLVER_LEGACY_ADDRESS } from 'lib/constants'
import { Domain, NFTToken, currentNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { nftToAvatarRecord } from 'lib/utils'

const TEXT_AVATAR_FIELD = 'avatar'

/**
 * Updates `avatar` text record for a given domain
 */
export const useSendSetAvatar = ({
  domain,
  avatar,
  onError,
  onSuccess
}: {
  domain: Domain
  avatar: NFTToken | null
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const node = domain ? namehash(domain) : undefined

  const { config } = usePrepareContractWrite({
    address: ETH_RESOLVER_LEGACY_ADDRESS.get(currentNetwork()),
    abi: ETH_RESOLVER_ABI,
    functionName: 'setText',
    enabled: Boolean(node) && Boolean(avatar),
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
