import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Network } from 'lib/types'
import { useContractRead } from 'wagmi'

// Generates a commitment hash for future ENS registration
// 'name' is the name part of {name}.eth domain
// https://github.com/ensdomains/ens-contracts/blob/934fd3ee5575de11958e40f9862a43ebb21bc22c/contracts/ethregistrar/ETHRegistrarController.sol#L70
export function useMakeCommitment(
  name: string,
  address: string | undefined,
  secret: string,
  network: Network
) {
  const {
    data: commitmentHash,
    isError,
    isLoading
  } = useContractRead<string[], 'makeCommitmentWithConfig', string>({
    abi: ETH_REGISTRAR_ABI,
    address: ETH_REGISTRAR_ADDRESS.get(network),
    functionName: 'makeCommitmentWithConfig',
    args: [name, address, secret, ETH_RESOLVER_ADDRESS.get(network), address]
  })
  return { commitmentHash, isError, isLoading }
}
