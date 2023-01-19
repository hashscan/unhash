import { Network } from './types'

export const API_URL = 'https://xens-api.vercel.app'

export const NETWORKS: Network[] = ['mainnet', 'goerli']

export const ETH_REGISTRAR_ADDRESS = '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'
export const GOERLI_REGISTRAR_ADDRESS = '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'

export const ETH_RESOLVER_ADDRESS = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'

export const ETH_REGISTRAR_ABI = [
  'function available(string) view returns (bool)',
  'function makeCommitment(string,address,bytes32) pure returns (bytes32)',
  'function commit(bytes32)',
  'function register(string,address,uint256,bytes32) payable',
  'function registerWithConfig(string memory name, address owner, uint duration, bytes32 secret, address resolver, address addr) public payable'
]

export const YEAR_IN_SECONDS = 365 * 60 * 60 * 24
