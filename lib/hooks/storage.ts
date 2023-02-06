import { Registration } from 'lib/types'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

export function useRegistration(name: string) {
  const [registration, setRegistration] = useLocalStorage<Registration | null>(`ens.registration.${name}`, null)

  // TODO: implement
  // creates registration with commitPending status
  const createRegistration = (commitTxHash: string) => {
    // setRegistration((reg) => {
    //   if (!reg) return null
    //   return {
    //     ...reg,
    //     status: 'commitPending',
    //     commitTxHash
    //   }
    // })
  }
  
  return { registration, setRegistration, createRegistration }
}

export const useRegistrationRead = (name: string) => {
  const registration = useReadLocalStorage<Registration | null>(`ens.registration.${name}`)
  return registration
}
