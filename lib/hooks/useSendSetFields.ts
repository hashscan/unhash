import { BigNumber } from 'ethers'
import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { toNetwork } from 'lib/types'
import { useChainId, useContract, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRegistration } from './storage'

export const useSendSetFields = ({ name }: { name: string }) => {
  const chainId = useChainId()
  const { registration } = useRegistration(name)

  const resolverAddress = ETH_RESOLVER_ADDRESS.get(toNetwork(chainId))

  const node = namehash(name)
  const contract = useContract({ abi: ETH_RESOLVER_ABI, address: resolverAddress })
  const filteredFields = Object.entries(registration?.fields!).filter(([_, v]) => typeof v === 'string' && v !== '')

  const encoded = filteredFields.map(([k, v]) => contract?.interface.encodeFunctionData('setText', [node, k, v]))

  const { config } = usePrepareContractWrite({
    address: resolverAddress,
    abi: ETH_RESOLVER_ABI,
    functionName: 'multicall',
    enabled: encoded.length !== 0,
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
    hash: data?.hash
  })

  return { data, isLoading, write, config, isSuccess, writeError, remoteError, isWriteError, isRemoteError }
}
