import { Registration, RegistrationStatus } from 'lib/types'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

export const useRegisterStatus = () => {
  const [status, setStatus] = useLocalStorage<RegistrationStatus>('status', 'start')

  return { status, setStatus }
}

export function useRegistration(name: string) {
  const [registration, setRegistration] = useLocalStorage<Registration | null>(`ens.registration.${name}`, null)

  return { registration, setRegistration }
}

export const useRegistrationRead = (name: string) => {
  const registration = useReadLocalStorage<Registration>(`ens.registration.${name}`)
  return registration
}
