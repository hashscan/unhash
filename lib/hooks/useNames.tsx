import { useLocalStorage } from 'usehooks-ts'
import { Domain } from 'lib/types'

export const useCart = () => {
  return useLocalStorage<{names: Domain[]}>('unhash_names', {names:[]})
}
