import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Domain, TextRecords, currentNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import {
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'

export const useSendUpdateRecords = ({
  domain,
  records,
  onError,
  onSuccess
}: {
  domain: Domain
  records: TextRecords
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const resolverAddress = ETH_RESOLVER_ADDRESS.get(currentNetwork())
  const contract = useContract({ abi: ETH_RESOLVER_ABI, address: resolverAddress })! // must always be defined

  const node = domain ? namehash(domain) : undefined
  const encoded = Object.entries(records).map(([key, record]) =>
    contract?.interface.encodeFunctionData('setText', [node, key, record])
  )

  const { config } = usePrepareContractWrite({
    address: resolverAddress,
    abi: ETH_RESOLVER_ABI,
    functionName: 'multicall',
    enabled: encoded.length !== 0 && Boolean(domain),
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
