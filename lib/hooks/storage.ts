import { YEAR_IN_SECONDS } from 'lib/constants'
import { Registration, RegistrationStatus } from 'lib/types'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

export const useRegisterDuration = () => {
  const [duration, setDuration] = useLocalStorage<number>('duration', YEAR_IN_SECONDS)
  return { duration, setDuration }
}
export const useCommitSecret = (defaultValue = '') => {
  const [secret, setSecret] = useLocalStorage<string>('commit-secret', defaultValue)

  return { secret, setSecret }
}

export const useRegisterStatus = () => {
  const [status, setStatus] = useLocalStorage<RegistrationStatus>('status', 'start')

  return { status, setStatus }
}

export const useBlockNumber = () => {
  const [blockNumber, setBlockNumber] = useLocalStorage<number>('commit-tx-block', 0)
  return { blockNumber, setBlockNumber }
}

export function useRegistration(domain: string) {
  const [registration, setRegistration] = useLocalStorage<Registration | null>(`ens.registration.${domain}`, null)

  return { registration, setRegistration }
}

export const useRegistrationRead = (domain: string) => {
  const registration = useReadLocalStorage<Registration | null>(`ens.registration.${domain}`)
  return registration
}
