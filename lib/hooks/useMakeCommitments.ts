import { makeCommitments } from 'lib/ensUtils'
import { Domain } from 'lib/types'
import { useMemo } from 'react'

/**
 * Helper hook to generate a list of secrets and commitments for names with same arguments.
 */
export function useMakeCommitments({
  names,
  owner
}: {
  names: Domain[]
  owner?: string // required to get result; hooks is disabled unless it's set
}) {
  const namesHash = names.join(',')

  const results = useMemo(() => {
    if (!owner) return undefined

    const names = namesHash.split(',') as Domain[]
    return makeCommitments(names, owner)
  }, [namesHash, owner])

  return { ...results }
}
