import { Network } from './types'

export const API_URL = 'https://xens-api.vercel.app'

export const NETWORKS: Network[] = ['mainnet', 'goerli']

export const ETH_REGISTRAR_ADDRESS = new Map<Network, `0x${string}`>([
  ['mainnet', '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'],
  ['goerli', '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5']
])

export const ETH_RESOLVER_ADDRESS = new Map<Network, `0x${string}`>([
  ['mainnet', '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'],
  ['goerli', '0x2800Ec5BAB9CE9226d19E0ad5BC607e3cfC4347E']
])

export const ETH_REGISTRAR_ABI = [
  'function available(string) view returns (bool)',
  'function makeCommitment(string,address,bytes32) pure returns (bytes32)',
  'function commit(bytes32)',
  'function makeCommitmentWithConfig(string,address,bytes32,address,address) pure returns (bytes32)',
  'function register(string,address,uint256,bytes32) payable',
  'function registerWithConfig(string,address,uint,bytes32,address,address) payable'
]

export const ETH_RESOLVER_ABI = [
  'function setText(bytes32,string,string)',
  'function text(bytes32,key)',
  'function multicall(bytes[])'
]

export const YEAR_IN_SECONDS = 365 * 60 * 60 * 24
