import { Registration } from "lib/types"
import { useLocalStorage } from "usehooks-ts"
import { useCallback } from "react"

// helper type to avoid long type declaration
type CreateRegistrationParams = {
  name: string
  owner: string
  duration: number
  secret: string
  commitTxHash: string
}

export function useRegistration(name: string) {
  const [registrations, setRegistrations] = useLocalStorage<Registration[]>(`ens.registrations`, [])
  const registration = registrations.find((reg) => reg.name === name)

  // Create new registration with the 'commitPending' status
  const create = useCallback((r: CreateRegistrationParams) => {
    setRegistrations((_registrations) => {
      if (_registrations.find((r) => r.name === name)) {
        throw new Error('Registration already exists')
      }

      return [
        ..._registrations,
        {
          ...r,
          status: 'commitPending',
        }]
    })
  }, [name, setRegistrations])

  // Update the registration status to 'committed'
  const setCommited = useCallback((commitBlock: number, commitTimestamp: number) => {
    setRegistrations((_registrations) => {
      const _registration = _registrations.find((r) => r.name === name)
      if (!_registration) throw new Error('Registration not found')

      return [
        ..._registrations.filter((r) => r.name !== name),
        {
          ..._registration,
          status: 'committed',
          commitBlock,
          commitTimestamp,
        }]
    })
  }, [name, setRegistrations])

  // Update the registration status to 'registerPending'
  const setRegistering = useCallback((registerTxHash: string) => {
    setRegistrations((_registrations) => {
      const _registration = _registrations.find((r) => r.name === name)
      if (!_registration) throw new Error('Registration not found')

      return [
        ..._registrations.filter((r) => r.name !== name),
        {
          ..._registration,
          status: 'registerPending',
          registerTxHash,
        }]
    })
  }, [name, setRegistrations])

  // Update the registration status to 'registered'
  const setRegistered = useCallback(() => {
    setRegistrations((_registrations) => {
      const _registration = _registrations.find((r) => r.name === name)
      if (!_registration) throw new Error('Registration not found')

      return [
        ..._registrations.filter((r) => r.name !== name),
        {
          ..._registration,
          status: 'registered',
        }]
    })
  }, [name, setRegistrations])

  return { registration, create, setCommited, setRegistering, setRegistered }
}