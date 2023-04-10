import api, { OrderPrice } from 'lib/api'
import { useEffect, useState } from 'react'

export const useOrderPrice = (
  names: string[],
  duration: number | undefined,
  dropOnChange: boolean = false
): OrderPrice | undefined => {
  const [prices, setPrice] = useState<OrderPrice | undefined>(undefined)

  useEffect(() => {
    if (!duration) {
      setPrice(undefined)
      return
    }
    if (dropOnChange) setPrice(undefined)

    const fetchPrice = async () => {
      try {
        const orderPrice = await api.getPrices(names, duration)
        setPrice(orderPrice)
      } catch (err) {
        console.log(`failed to fetch order price: ${err}`)
        setPrice(undefined)
      }
    }
    fetchPrice()
  }, [names, duration, dropOnChange])

  return prices
}
