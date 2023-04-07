import api, { DomainPrice } from 'lib/api'
import { toNetwork } from 'lib/types'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'

export const useDomainPrice = (
  domain: string,
  duration: number | undefined,
  dropOnChange: boolean = false
): DomainPrice | undefined => {
  const chainId = useChainId()
  const [price, setPrice] = useState<DomainPrice>()

  useEffect(() => {
    if (!duration) {
      setPrice(undefined)
      return
    }
    if (dropOnChange) setPrice(undefined)

    const fetchPrice = async () => {
      try {
        const result = await api.getPrices([domain], toNetwork(chainId), duration)
        setPrice(result.names[domain])
      } catch (err) {
        console.log(`failed to fetch domain price: ${err}`)
        setPrice(undefined)
      }
    }
    fetchPrice()
  }, [domain, duration, dropOnChange, chainId])

  return price
}
