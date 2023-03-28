import { XENS_ABI, XENS_ADDRESS } from 'lib/constants'
import { toNetwork } from 'lib/network'
import { generateCommitSecret } from 'lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { useChainId, useContractRead } from 'wagmi'

/**
 * Generates ENS commitments for a list of names.
 *
 * @param names list of name part of {name}.eth domain
 * @param owners addresses of future domain owner for each name
 * @returns list of commitments and secrets, associated with names
 */
export function useMakeCommitment(names: string[], owners: string[]) {
  const chainId = useChainId()

  const length = useMemo(() => names.length, [names])

  const [secrets, setSecrets] = useState<string[] | undefined>(undefined)
  useEffect(() => {
    const indices = [...Array(length).keys()]
    setSecrets(indices.map(() => generateCommitSecret()))
  }, [length])

  // do not set resolvers and addr
  const noArgList: (string | undefined)[] = useMemo(
    () => [...Array(length).keys()].map(() => undefined),
    [length]
  )

  const { data, error } = useContractRead<string[], 'makeCommitments', string[]>({
    abi: XENS_ABI,
    address: XENS_ADDRESS.get(toNetwork(chainId)),
    functionName: 'makeCommitments',
    enabled: names.length > 0 && names.length === owners.length && names.length === secrets?.length,
    args: [names, owners, secrets, noArgList, noArgList]
  })

  return {
    secrets: secrets,
    commitments: data,
    error: error
  }
}
