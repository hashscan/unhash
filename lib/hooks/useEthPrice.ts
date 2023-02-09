import { useEffect, useState } from 'react'

export const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState<number>()

  // TODO: replace CryptoCompare by custom API
  useEffect(() => {
    fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then((res) => res.json())
      .then((json) => {
        setEthPrice(json.USD)
      })
  }, [])
  return ethPrice
}
