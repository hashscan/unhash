import { useAccount, useChainId } from 'wagmi'
import { toNetwork } from 'lib/network'

import api from 'lib/api'

/**
 * Returns a fetcher to load NFTs from the API
 */
export const useFetchNFTs = (limit: number, continuation?: string) => {
  const { address } = useAccount()
  const network = toNetwork(useChainId())

  // the API currently does not support fetching NFTs from Goerli, so we just use a
  // placeholder address for now
  if (network === 'goerli') {
    return () =>
      api.userNFTs('mainnet', '0xB4b18818E9262584921b371c891b62219DaefeA3', limit, continuation)
  }

  return async () => {
    if (!address) throw new Error('No address provided')
    return await api.userNFTs(network, address, limit, continuation)
  }
}
