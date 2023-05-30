import { Interface } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI } from 'lib/constants'
import { getNodeForResolver } from 'lib/ensUtils'
import { Domain, TextRecords } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSendUpdateRecords = ({
  domain,
  resolver,
  records,
  onError,
  onSuccess
}: {
  domain: Domain
  resolver?: string
  records: TextRecords
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const iface = new Interface(ETH_RESOLVER_ABI)

  const node = resolver ? getNodeForResolver(domain, resolver) : undefined
  const encoded = node
    ? Object.entries(records).map(([key, record]) =>
        iface.encodeFunctionData('setText', [node, key, record])
      )
    : []

  const { config } = usePrepareContractWrite({
    address: resolver as `0x${string}` | undefined,
    abi: ETH_RESOLVER_ABI,
    functionName: 'multicall',
    enabled: Boolean(resolver) && encoded.length !== 0 && Boolean(domain),
    args: [encoded]
  })

  const {
    write,
    data,
    error: sendError,
    isLoading: isWriteLoading
  } = useContractWrite({
    ...config,
    onError
  })

  const { isLoading: isWaitLoading, error: waitError } = useWaitForTransaction({
    hash: data?.hash,
    onError,
    onSuccess
  })

  return {
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    error: sendError || waitError,
    sendUpdate: write,
    gasLimit: config.request?.gasLimit
  }
}
