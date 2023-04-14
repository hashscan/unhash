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
  owner: string | null
}) {
  const namesHash = names.join(',')

  return useMemo(() => {
    if (!owner) return {} as ReturnType<typeof makeCommitments>

    const names = namesHash.split(',') as Domain[]
    return makeCommitments(names, owner)
  }, [namesHash, owner])
}
