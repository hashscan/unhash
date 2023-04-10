import { currentNetwork } from 'lib/network'
import { useMemo } from 'react'

export const useEtherscanURL = (entity: 'address' | 'txn' | 'tx', hash: string): string => {
  if (entity === 'txn') entity = 'tx' // alias

  return useMemo(() => {
    if (typeof hash === 'undefined') return ''

    return [
      `https://${currentNetwork() === 'goerli' ? 'goerli.' : ''}etherscan.io`,
      encodeURIComponent(entity), // espaces things like '/' just in case
      encodeURIComponent(hash)
    ].join('/')
  }, [entity, hash])
}
