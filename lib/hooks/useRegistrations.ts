import { Registration, RegistrationStatus } from 'lib/types'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useAccount } from 'wagmi'

/**
 * Read-only hook to read all registrations with optional status filter.
 * @returns all registrations for the current user and undefined for non-authorized user.
 */
export function useRegistrations(status?: RegistrationStatus) {
  const { address: sender } = useAccount()
  const [registrations] = useLocalStorage<Registration[]>('ens.registrations', [])

  return useMemo(() => {
    if (!sender) return undefined
    return registrations.filter(
      (r) => r.sender.toLowerCase() === sender.toLowerCase() && (!status || r.status === status)
    )
  }, [status, sender, registrations])
}
