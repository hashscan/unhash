import type { Address } from 'wagmi'
import { Network } from './types'

export const API_URL = 'http://localhost:3001'

export const FEEDBACK_TWITTER = 'https://twitter.com/jackqack'
export const FEEDBACK_TELEGRAM = 'https://t.me/jackqack'

export const ETH_REGISTRAR_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'],
  ['goerli', '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5']
])

export const ETH_RESOLVER_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'],
  ['goerli', '0x2800Ec5BAB9CE9226d19E0ad5BC607e3cfC4347E']
])

export const ETH_REVERSE_REGISTRAR_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x084b1c3c81545d370f3634392de611caabff8148'],
  ['goerli', '0x4f7A657451358a22dc397d5eE7981FfC526cd856']
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
  'function multicall(bytes[])',
  'function setAddr(bytes32,uint256,bytes)'
]

export const ETH_REVERSE_REGISTRAR_ABI = ['function setName(string) returns (bytes32)']

export const YEAR_IN_SECONDS = 365 * 60 * 60 * 24

export const COMMIT_WAIT_MS = 60 * 1000

// Estimated gas limit for transactions. Should only
// be used for UI purposes, not for actual gas limit calculations.
export const COMMIT_GAS_LIMIT = 46_267
export const REGISTER_AVERAGE_GAS = 259_000 // on average based on quick look at Etherscan
