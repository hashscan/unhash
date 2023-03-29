import { Domain, Registration, RegistrationOrder } from 'lib/types'
import { useLocalStorage } from 'usehooks-ts'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { trackGoal } from 'lib/analytics'

// helper type to avoid long type declaration
type CreateRegistrationParams = {
  names: Domain[]
  sender: string
  owner?: string
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
export function useRegistration() {
  const { address: sender } = useAccount()
  const [registration, setRegistration] = useLocalStorage<Registration | undefined>(
    `ens.registration.${sender?.toLowerCase() ?? 'non-authorized'}`,
    undefined
  )

  // Create new registration with the 'commitPending' status
  const setCommitting = useCallback(
    (r: CreateRegistrationParams) => {
      setRegistration({
        ...r,
        status: 'commitPending'
      })
    },
    [setRegistration]
  )

  // Update the registration status to 'committed'
  const setCommitted = useCallback(
    (commitBlock: number, commitTimestamp: number) => {
      setRegistration((_registration) => {
        if (!_registration) throw new Error('Registration not found')
        trackGoal('Commit', { props: { names: _registration.names.join(',') } })

        return {
          ..._registration,
          status: 'committed',
          commitBlock,
          commitTimestamp,
          errorTxHash: undefined,
          errorTxMessage: undefined
        }
      })
    },
    [setRegistration]
  )

  // Update status back to 'created'
  const setCommitFailed = useCallback(
    (errorTxHash: string, errorTxMessage: string) => {
      setRegistration((_registration) => {
        if (!_registration) throw new Error('Registration not found')
        trackGoal('CommitFail', {
          props: { names: _registration.names.join(','), hsh: errorTxHash }
        })

        return {
          ..._registration,
          status: 'created',
          commitTxHash: undefined,
          errorTxHash,
          errorTxMessage
        }
      })
    },
    [setRegistration]
  )

  // Update the registration status to 'registerPending'
  const setRegistering = useCallback(
    (registerTxHash: string) => {
      setRegistration((_registration) => {
        if (!_registration) throw new Error('Registration not found')

        return {
          ..._registration,
          status: 'registerPending',
          registerTxHash,
          errorTxHash: undefined,
          errorTxMessage: undefined
        }
      })
    },
    [setRegistration]
  )

  // Update the registration status to 'registered'
  const setRegistered = useCallback(() => {
    setRegistration((_registration) => {
      if (!_registration) throw new Error('Registration not found')
      trackGoal('Register', { props: { names: _registration.names.join(',') } })

      return {
        ..._registration,
        status: 'registered',
        errorTxHash: undefined,
        errorTxMessage: undefined
      }
    })
  }, [setRegistration])

  // Update the registration status back to 'committed'
  const setRegisterFailed = useCallback(
    (errorTxHash: string, errorTxMessage: string) => {
      setRegistration((_registration) => {
        if (!_registration) throw new Error('Registration not found')
        trackGoal('RegisterFail', {
          props: { names: _registration.names.join(','), hsh: errorTxHash }
        })

        return {
          ..._registration,
          status: 'committed',
          registerTxHash: undefined,
          errorTxHash,
          errorTxMessage
        }
      })
    },
    [setRegistration]
  )

  const cancel = useCallback(() => {
    setRegistration(undefined)
  }, [setRegistration])

  return {
    registration,
    setCommitting,
    setCommited: setCommitted,
    setCommitFailed,
    setRegistering,
    setRegistered,
    setRegisterFailed,
    cancel
  }
}
