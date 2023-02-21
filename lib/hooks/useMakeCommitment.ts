import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Network } from 'lib/types'
import { generateCommitSecret } from 'lib/utils'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'

/**
 * Generates a commitment hash for ENS commit transaction.
 * @see https://github.com/ensdomains/ens-contracts/blob/934fd3ee5575de11958e40f9862a43ebb21bc22c/contracts/ethregistrar/ETHRegistrarController.sol#L70
 *
 * @param name name part of {name}.eth domain
 * @param owner address of future domain owner
 * @returns commitment hash and secret to be used in commit transaction
 */
export function useMakeCommitment(name: string, network: Network, owner: string | undefined) {
  const [secret, setSecret] = useState<string | undefined>(undefined)
  useEffect(() => setSecret(generateCommitSecret()), [])

  const { data, error } = useContractRead<string[], 'makeCommitmentWithConfig', string>({
    abi: ETH_REGISTRAR_ABI,
    address: ETH_REGISTRAR_ADDRESS.get(network),
    functionName: 'makeCommitmentWithConfig',
    enabled: Boolean(owner) && Boolean(secret),
    args: [
      name,
      owner,
      secret,
      '0x0000000000000000000000000000000000000000', // ETH_RESOLVER_ADDRESS.get(network) (no need to pass if addr is empty)
      '0x0000000000000000000000000000000000000000' // temporary undefined until we it
    ]
  })
  return {
    secret: secret,
    commitment: data,
    error: error
  }
}
