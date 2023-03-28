import { makeCommitments } from 'lib/ensUtils'
import { Domain } from 'lib/types'
import { useMemo } from 'react'

/**
 * Helper hook to generate a list of secrets and commitments for names with same arguments.
 * Make sure to use stable reference to 'names'.
 */
export function useMakeCommitments({
  names,
  owner
}: {
  names: Domain[]
  owner?: string // required to get result; hooks is disabled unless it's set
}) {
  const results = useMemo(() => {
    if (!owner) return undefined

    return makeCommitments(names, owner)
  }, [names, owner])

  return { ...results }
}
