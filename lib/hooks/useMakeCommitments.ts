import { makeCommitment } from 'lib/ensUtils'
import { Domain } from 'lib/types'
import { useMemo } from 'react'

/**
 * Helper hook to generate a list of secrets and commitments for names with same arguments.
 * Make sure to use stable reference to 'names'.
 */
export function useMakeCommitments({
  names,
  owner,
  resolver,
  addr
}: {
  names: Domain[]
  owner?: string // required to get result; hooks is disabled unless it's set
  resolver?: string
  addr?: string
}) {
  const results = useMemo(() => {
    if (!owner) return undefined

    console.log(`useMakeCommitments.useMemo triggered: names = ${JSON.stringify(names)}`)

    return names.map((name) =>
      makeCommitment({
        name,
        owner,
        resolver,
        addr
      })
    )
  }, [names, owner, resolver, addr])

  return results
}
