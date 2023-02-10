import { Domain, Registration } from 'lib/types'
import { useLocalStorage } from 'usehooks-ts'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'

// helper type to avoid long type declaration
type CreateRegistrationParams = {
  domain: Domain
  sender: string
  owner: string
  duration: number
  secret: string
  commitTxHash: string
}

/**
 * Hook for managing Registration in LocalStorage.
 *
 * Requires user to be connected to the wallet.
 * @returns active Registration for the current user and undefined for non-authorized user.
 */
export function useRegistration(domain: Domain) {
  const { address: sender } = useAccount()
  const [registrations, setRegistrations] = useLocalStorage<Registration[]>('ens.registrations', [])

  // filter registration by domain and sender
  const registration = useMemo(() => {
    if (!sender) return undefined
    return registrations.find(
      (reg) => reg.domain === domain && reg.sender.toLowerCase() === sender?.toLowerCase()
    )
  }, [domain, sender, registrations])

  // Create new registration with the 'commitPending' status
  const create = useCallback(
    (r: CreateRegistrationParams) => {
      setRegistrations((_registrations) => {
        if (_registrations.find((r) => r.domain === domain)) {
          throw new Error('Registration already exists')
        }

        return [
          ..._registrations,
          {
            ...r,
            status: 'commitPending'
          }
        ]
      })
    },
    [domain, setRegistrations]
  )

  // Update the registration status to 'committed'
  const setCommited = useCallback(
    (commitBlock: number, commitTimestamp: number) => {
      setRegistrations((_registrations) => {
        const _registration = _registrations.find((r) => r.domain === domain)
        if (!_registration) throw new Error('Registration not found')

        return [
          ..._registrations.filter((r) => r.domain !== domain),
          {
            ..._registration,
            status: 'committed',
            commitBlock,
            commitTimestamp
          }
        ]
      })
    },
    [domain, setRegistrations]
  )

  // Update the registration status to 'registerPending'
  const setRegistering = useCallback(
    (registerTxHash: string) => {
      setRegistrations((_registrations) => {
        const _registration = _registrations.find((r) => r.domain === domain)
        if (!_registration) throw new Error('Registration not found')

        return [
          ..._registrations.filter((r) => r.domain !== domain),
          {
            ..._registration,
            status: 'registerPending',
            registerTxHash
          }
        ]
      })
    },
    [domain, setRegistrations]
  )

  // Update the registration status to 'registered'
  const setRegistered = useCallback(() => {
    setRegistrations((_registrations) => {
      const _registration = _registrations.find((r) => r.domain === domain)
      if (!_registration) throw new Error('Registration not found')

      return [
        ..._registrations.filter((r) => r.domain !== domain),
        {
          ..._registration,
          status: 'registered'
        }
      ]
    })
  }, [domain, setRegistrations])

  return { registration, create, setCommited, setRegistering, setRegistered }
}
