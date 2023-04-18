import { useLocalStorage } from 'usehooks-ts'
import { Domain } from 'lib/types'

export const useNames = () => {
  return useLocalStorage<Domain[]>('unhash_names', [])
}
