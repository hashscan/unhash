import { Registration } from 'lib/types'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

export function useRegistration(name: string) {
  const [registrations, setRegistrations] = useLocalStorage<Registration[]>(`ens.registrations`, [])

  const registration = registrations.find((r) => r.name === name)
  const setRegistration = (reg: Registration) =>
    setRegistrations([...registrations.filter((r) => r.name !== name), reg])

  return { registration, setRegistration }
}

export const useRegistrationRead = (name: string) => {
  const registration = useReadLocalStorage<Registration | null>(`ens.registration.${name}`)
  return registration
}
