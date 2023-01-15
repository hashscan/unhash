import { ENS } from '@ensdomains/ensjs'
import { publicProvider } from 'lib/constants'
import { useEffect } from 'react'

export const useENSInstance = () => {
  const ens = new ENS({})

  useEffect(() => {
    ens.setProvider(publicProvider)
  }, [])
  return ens
}
