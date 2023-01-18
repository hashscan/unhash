import { ENS } from '@ensdomains/ensjs'
import { providers } from 'ethers'
import { useEffect, useState } from 'react'

const ens = new ENS({})

export const useENSInstance = (provider: providers.JsonRpcProvider) => {
  const [isReady, setReady] = useState(false)

  useEffect(() => {
    if (provider) {
      ens.setProvider(provider).then(() => {
        setReady(true)
      })
    }
  }, [provider])

  return { ens, isReady }
}
