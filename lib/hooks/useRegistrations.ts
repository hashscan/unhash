import { Registration, RegistrationStatus } from "lib/types"
import { useLocalStorage } from "usehooks-ts"

// Read-only hook to read all registrations with optional status
export function useRegistration(status?: RegistrationStatus) {
  const [registrations,] = useLocalStorage<Registration[]>(`ens.registrations`, [])
  return registrations.filter((r) => !status || r.status === status)
}