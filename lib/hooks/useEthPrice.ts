import api from 'lib/api'
import { useEffect, useState } from 'react'

export const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState<number>()

  useEffect(() => {
    api.ethPrice().then((price) => setEthPrice(price.usd))
  }, [])
  return ethPrice
}
