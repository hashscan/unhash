import { ENS } from '@ensdomains/ensjs'

export const useENSInstance = () => {
  const ens = new ENS({})

  return ens
}
