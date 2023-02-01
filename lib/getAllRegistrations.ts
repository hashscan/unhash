import { Registration } from './types'
import { parseJSON } from './utils'

export const getAllRegistrations = () => {
  const registrations: Registration[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const item = localStorage.getItem(key)
      if (key.includes('ens.registration') && item) {
        const reg = parseJSON<Registration>(item)
        if (reg?.commitTxHash || reg?.registerTxHash) registrations.push(reg)
      }
    }
  }
  return registrations
}
