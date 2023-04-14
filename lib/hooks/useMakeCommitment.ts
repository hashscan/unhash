import { makeCommitment } from 'lib/ensUtils'
import { CommitmentParams } from 'lib/types'
import { useMemo } from 'react'

/**
 * Helper hook to generate a secret and commitment with nullable owner and result.
 */
export function useMakeCommitment({
  name,
  owner,
  resolver,
  addr
}: Omit<CommitmentParams, 'owner'> & {
  owner: string | null
}) {
  return useMemo(() => {
    if (!owner) return {} as ReturnType<typeof makeCommitment>

    return makeCommitment({
      name,
      owner,
      resolver,
      addr
    })
  }, [name, owner, resolver, addr])
}
