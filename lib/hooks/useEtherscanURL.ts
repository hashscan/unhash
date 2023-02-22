import { useMemo } from 'react'
import { useChainId } from 'wagmi'

export const useEtherscanURL = (entity: 'address' | 'txn' | 'tx', hash: string): string => {
  const chainId = useChainId()

  if (entity === 'txn') entity = 'tx' // alias

  return useMemo(() => {
    if (typeof hash === 'undefined') return ''

    return [
      `https://${chainId === 5 ? 'goerli.' : ''}etherscan.io`,
      encodeURIComponent(entity), // espaces things like '/' just in case
      encodeURIComponent(hash)
    ].join('/')
  }, [chainId, entity, hash])
}
