import { Registration } from 'lib/types'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

export function useRegistration(name: string) {
  const [registration, setRegistration] = useLocalStorage<Registration | null>(`ens.registration.${name}`, null)

  return { registration, setRegistration }
}

export const useRegistrationRead = (name: string) => {
  const registration = useReadLocalStorage<Registration>(`ens.registration.${name}`)
  return registration
}
