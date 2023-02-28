/* eslint-disable no-unused-vars */
import { mainnet, goerli, Chain } from 'wagmi/chains'

export type Network = 'mainnet' | 'goerli'

// Maps Network to wagmi.Chain
export function toChain(network: Network): Chain {
  switch (network) {
    case 'mainnet':
      return mainnet
    case 'goerli':
      return goerli
  }
}

// Maps wagmi.Chain.id to Network
export function toNetwork(chainId: number): Network {
  switch (chainId) {
    case mainnet.id:
      return 'mainnet'
    case goerli.id:
      return 'goerli'
    default:
      throw new Error('Unsupported chain')
  }
}

// Address domain currently supported by API
export type AddrRecords = {
  ethereum?: string
}

// Text domain records currently supported by API
export type TextRecords = {
  name?: string
  description?: string
  email?: string
  url?: string
  'com.twitter'?: string
}

export type UserInfo = {
  primaryEns: Domain | null
  domains: UserDomain[]
}

export type UserDomain = {
  name: Domain
  namehash: string | null
  isValid: boolean
  owned: boolean
  controlled: boolean
  resolved: boolean
}

export type Registration = {
  domain: Domain
  sender: string // who is registering the domain
  owner?: string // who will own the domain
  duration: number // seconds
  secret: string
  status: RegistrationStatus
  commitTxHash?: string
  commitBlock?: number
  commitTimestamp?: number
  registerTxHash?: string
  errorTxHash?: string // refers to commit if commitTxHash is not set or to registerTxHash otherwise
  errorTxMessage?: string
}

export type RegistrationStatus =
  | 'created'
  | 'commitPending'
  | 'committed'
  | 'registerPending'
  | 'registered'

// holds current registration settings prior to the checkout (aka shopping cart)
export type RegistrationOrder = {
  domain: Domain
  durationInYears: number
  ownerAddress: string | undefined
}

export type Domain = `${string}.eth`
