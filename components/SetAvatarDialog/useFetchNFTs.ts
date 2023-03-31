import { useAccount, useChainId } from 'wagmi'
import { toNetwork } from 'lib/network'

import api from 'lib/api'

/**
 * Returns a fetcher to load NFTs from the API
 */
export const useFetchNFTs = (limit: number, continuation?: string) => {
  const { address } = useAccount()
  const network = toNetwork(useChainId())

  return async () => {
    if (!address) throw new Error('No address provided')
    return await api.userNFTs(network, address, limit, continuation)
  }
}
