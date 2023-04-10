import api, { DomainPrice } from 'lib/api'
import { useEffect, useState } from 'react'

export const useDomainPrice = (
  domain: string,
  duration: number | undefined,
  dropOnChange: boolean = false
): DomainPrice | undefined => {
  const [price, setPrice] = useState<DomainPrice>()

  useEffect(() => {
    if (!duration) {
      setPrice(undefined)
      return
    }
    if (dropOnChange) setPrice(undefined)

    const fetchPrice = async () => {
      try {
        const result = await api.getPrices([domain], duration)
        setPrice(result.names[domain])
      } catch (err) {
        console.log(`failed to fetch domain price: ${err}`)
        setPrice(undefined)
      }
    }
    fetchPrice()
  }, [domain, duration, dropOnChange])

  return price
}
