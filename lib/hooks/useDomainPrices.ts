import api, { DomainPrices } from 'lib/api'
import { toNetwork } from 'lib/types'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'

function zip<T>(names: string[], values?: T[]) {
  return Object.fromEntries(names.map((name, index) => [name, values ? values[index] : undefined]))
}

export const useDomainPrices = (
  names: string[],
  duration: number | undefined,
  dropOnChange: boolean = false
): Partial<DomainPrices> => {
  const chainId = useChainId()
  const [prices, setPrice] = useState<Partial<DomainPrices>>(() => zip(names))

  useEffect(() => {
    if (!duration) {
      setPrice(zip(names))
      return
    }
    if (dropOnChange) setPrice(zip(names))

    const fetchPrice = async () => {
      try {
        const results = await api.getPrices(names, toNetwork(chainId), duration)
        setPrice(results)
      } catch (err) {
        console.log(`failed to fetch domain price: ${err}`)
        setPrice(zip(names))
      }
    }
    fetchPrice()
  }, [names, duration, dropOnChange, chainId])

  return prices
}
