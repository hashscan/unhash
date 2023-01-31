import { Registration } from 'lib/types'
import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'

export const TxCheck = () => {
  const [regs, setRegs] = useState<Registration[]>([])
  const provider = useProvider()

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const item = localStorage.getItem(key)
        if (key.includes('ens.registration') && item) {
          setRegs((r) => [...r, JSON.parse(item)])
        }
      }
    }
  }, [])
}
