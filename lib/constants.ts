import type { Address } from 'wagmi'
import { Network } from './types'

export const API_URL = 'https://api.unhash.com'

export const FEEDBACK_TWITTER = 'https://twitter.com/jackqack'
export const FEEDBACK_TELEGRAM = 'https://t.me/jackqack'

export const ETH_REGISTRAR_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x253553366da8546fc250f225fe3d25d0c782303b'],
  ['goerli', '0xCc5e7dB10E65EED1BBD105359e7268aa660f6734']
])

// export const ETH_RESOLVER_LEGACY_ADDRESS = new Map<Network, Address>([
//   ['mainnet', '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'],
//   ['goerli', '0x2800Ec5BAB9CE9226d19E0ad5BC607e3cfC4347E']
// ])

export const ETH_RESOLVER_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63'],
  ['goerli', '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750']
])

export const ETH_REVERSE_REGISTRAR_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x084b1c3c81545d370f3634392de611caabff8148'],
  ['goerli', '0x4f7A657451358a22dc397d5eE7981FfC526cd856']
])

export const BASE_REGISTRAR_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'],
  ['goerli', '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85']
])

export const NAME_WRAPPER_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401'],
  ['goerli', '0x114D4603199df73e7D157787f8778E21fCd13066']
])

export const UNHASH_ADDRESS = new Map<Network, Address>([
  ['mainnet', '0x9001a8B74536AA6df3ee675057F6F4355C03f949'],
  ['goerli', '0x3e0c4c5ed99e97b0ed051910a53834f218f1e144']
])

export const ETH_REGISTRAR_ABI = [
  'function commit(bytes32)',
  'function register(string,address,uint256,bytes32,address,bytes[], bool, uint16) payable',
  'function renew(string,uint256) payable'
]

export const ETH_RESOLVER_ABI = [
  'function setText(bytes32,string,string)',
  'function text(bytes32,key)',
  'function multicall(bytes[])',
  'function setAddr(bytes32,uint256,bytes)'
]

export const ETH_REVERSE_REGISTRAR_ABI = ['function setName(string) returns (bytes32)']

export const BASE_REGISTRAR_ABI = ['function safeTransferFrom(address, address, uint256)']

export const NAME_WRAPPER_ABI = [
  'function safeTransferFrom(address, address, uint256, uint256, bytes)'
]

export const UNHASH_ABI = [
  'function commit(bytes32[] _commitments)',
  'function register(string[] _names,address[] _owners,uint256[] _durations,bytes32[] _secrets,uint256[] _prices) external payable',
  'function renew(string[] _names, uint256[] _durations, uint256[] _prices)'
]

export const YEAR_IN_SECONDS = 365 * 60 * 60 * 24

export const COMMIT_WAIT_MS = 60 * 1000

export function getNameContract(network: Network, isWrapped: boolean): Address {
  return isWrapped ? NAME_WRAPPER_ADDRESS.get(network)! : BASE_REGISTRAR_ADDRESS.get(network)!
}

export function getNameContractABI(isWrapped: boolean): string[] {
  return isWrapped ? NAME_WRAPPER_ABI : BASE_REGISTRAR_ABI
}
