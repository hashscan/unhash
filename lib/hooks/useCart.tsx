import { useLocalStorage } from 'usehooks-ts'
import { Cart } from 'lib/types'

export const useCart = () => {
  return useLocalStorage<Cart>('unhash_names', { names: [] })
}
