import api from 'lib/api'
import { toNetwork } from 'lib/types'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'

export const useDomainPrice = (domain: string, durationYears: number) => {
  const chainId = useChainId()
  const [price, setPrice] = useState<number>()

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const result = await api.getPrice(
          domain,
          toNetwork(chainId),
          durationYears * 365 * 24 * 60 * 60
        )
        setPrice(result.usd)
      } catch (err) {
        console.log(`failed to fetch domain price: ${err}`)
        setPrice(undefined)
      }
    }
    fetchPrice()
  }, [domain, durationYears, chainId])

  return price
}
