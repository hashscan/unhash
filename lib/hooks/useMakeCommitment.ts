import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Network } from 'lib/types'
import { generateCommitSecret } from 'lib/utils'
import { useState } from 'react'
import { useContractRead } from 'wagmi'

/**
 * Generates a commitment hash for ENS commit transaction.
 * @see https://github.com/ensdomains/ens-contracts/blob/934fd3ee5575de11958e40f9862a43ebb21bc22c/contracts/ethregistrar/ETHRegistrarController.sol#L70
 *
 * @param name name part of {name}.eth domain
 * @param owner address of future domain owner
 * @returns commitment hash and secret to be used in commit transaction
 */
export function useMakeCommitment(name: string, network: Network, owner: string) {
  const [secret] = useState(() => generateCommitSecret())

  const { data, error } = useContractRead<string[], 'makeCommitmentWithConfig', string>({
    abi: ETH_REGISTRAR_ABI,
    address: ETH_REGISTRAR_ADDRESS.get(network),
    functionName: 'makeCommitmentWithConfig',
    enabled: Boolean(secret),
    args: [name, owner, secret, ETH_RESOLVER_ADDRESS.get(network), owner]
  })
  return {
    secret: secret,
    commitment: data,
    error: error
  }
}
