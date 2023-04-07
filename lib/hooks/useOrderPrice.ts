import api, { OrderPrice } from 'lib/api'
import { toNetwork } from 'lib/types'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'

export const useOrderPrice = (
  names: string[],
  duration: number | undefined,
  dropOnChange: boolean = false
): OrderPrice | undefined => {
  const chainId = useChainId()
  const [prices, setPrice] = useState<OrderPrice | undefined>(undefined)

  useEffect(() => {
    if (!duration) {
      setPrice(undefined)
      return
    }
    if (dropOnChange) setPrice(undefined)

    const fetchPrice = async () => {
      try {
        const orderPrice = await api.getPrices(names, toNetwork(chainId), duration)
        setPrice(orderPrice)
      } catch (err) {
        console.log(`failed to fetch order price: ${err}`)
        setPrice(undefined)
      }
    }
    fetchPrice()
  }, [names, duration, dropOnChange, chainId])

  return prices
}
