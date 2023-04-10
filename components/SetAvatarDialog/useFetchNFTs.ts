import { useAccount } from 'wagmi'

import api from 'lib/api'

/**
 * Returns a fetcher to load NFTs from the API
 */
export const useFetchNFTs = (limit: number, continuation?: string) => {
  const { address } = useAccount()

  return async () => {
    if (!address) throw new Error('No address provided')
    return await api.userNFTs(address, limit, continuation)
  }
}
