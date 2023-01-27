import { BigNumber, providers } from 'ethers'
import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Domain, Fields, toNetwork } from 'lib/types'
import { useChainId, useContract, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSendSetFields = ({
  domain,
  fields,
  onSuccess
}: Partial<{
  domain: Domain | null
  fields: Fields
  onSuccess: ((data: providers.TransactionReceipt) => void) | undefined
}>) => {
  const chainId = useChainId()

  const resolverAddress = ETH_RESOLVER_ADDRESS.get(toNetwork(chainId))

  const node = domain ? namehash(domain) : undefined
  const contract = useContract({ abi: ETH_RESOLVER_ABI, address: resolverAddress })
  const filteredFields =
    fields && node ? Object.entries(fields).filter(([_, v]) => typeof v === 'string' && v !== '') : []

  const encoded = filteredFields.map(([k, v]) => contract?.interface.encodeFunctionData('setText', [node, k, v]))

  const { config } = usePrepareContractWrite({
    address: resolverAddress,
    abi: ETH_RESOLVER_ABI,
    functionName: 'multicall',
    enabled: encoded.length !== 0 && Boolean(domain),
    args: [encoded],
    overrides: {
      gasLimit: BigNumber.from(250_000)
    }
  })

  const {
    write,
    data,
    error: writeError,
    isError: isWriteError
  } = useContractWrite({
    ...config
  })

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess
  })

  return { data, isLoading, write, config, isSuccess, writeError, remoteError, isWriteError, isRemoteError }
}
