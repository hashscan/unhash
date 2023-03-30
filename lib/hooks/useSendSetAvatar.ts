import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Domain, toNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

const TEXT_AVATAR_FIELD = 'avatar'

const ALLOWED_ERCs = ['erc721', 'erc1155'] as const

interface Avatar {
  contract: string
  name: string
  kind: typeof ALLOWED_ERCs[number]
}

const avatarToRecord = (avatar: Avatar) => {
  console.assert(
    ALLOWED_ERCs.includes(avatar.kind),
    `ENS only supports ${ALLOWED_ERCs.join(', ')} avatars at the moment`
  )

  return `eip155:1/${avatar.kind}:${avatar.contract}/${avatar.name}`
}

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
  avatar: Avatar | null
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const chainId = useChainId()
  const node = domain ? namehash(domain) : undefined

  const { config } = usePrepareContractWrite({
    address: ETH_RESOLVER_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_RESOLVER_ABI,
    functionName: 'setText',
    enabled: Boolean(node) && Boolean(avatar),
    args: [node, TEXT_AVATAR_FIELD, avatar ? avatarToRecord(avatar) : null]
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
