import { BigNumber } from 'ethers'
import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Domain, DomainRecords, toNetwork } from 'lib/types'
import {
  useChainId,
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'

export const useSendUpdateRecords = ({
  domain,
  records,
  onError
}: {
  domain: Domain
  records: DomainRecords
  onError?: (e: Error) => void
}) => {
  const chainId = useChainId()

  const resolverAddress = ETH_RESOLVER_ADDRESS.get(toNetwork(chainId))
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
    onError: onError
  })

  const { isLoading: isWaitLoading, error: waitError } = useWaitForTransaction({
    hash: data?.hash
  })

  return {
    isLoading: isWriteLoading || isWaitLoading,
    error: sendError || waitError,
    sendUpdate: write,
    gasLimit: config.request?.gasLimit
  }
}
