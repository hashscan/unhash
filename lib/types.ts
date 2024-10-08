export * from './network'

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
  primaryName?: {
    name: Domain
    avatar?: string // raw avatar record value: eip155:1/erc1155:0xd07dc4262bcdbf85190c01c996b4c06a461d2430/511690
  }
  reverseName?: Domain
  domains: UserDomain[]
}

export type UserDomain = {
  name: Domain
  namehash: string | null
  isValid: boolean
  isWrapped?: boolean
  owned: boolean
  controlled: boolean // controlled by NameWrapper contract for wrapped names
  resolved: boolean
  registeredAt?: number
  expiresAt?: number
  resolver?: string
}

export type Registration = {
  names: Domain[]
  sender: string // who is registering the domain
  owner?: string // who will own the domain; TODO: can't be nullable, fix
  duration: number // seconds
  secret: string
  // following fields ignored for multiple names
  resolver?: string
  data: string[]
  reverseRecord: boolean
  ownerControlledFuses: number

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
  names: Domain[]
  durationInYears: number
  ownerAddress: string | undefined | null // null means error, undefined means not set
}

export type Cart = {
  names: Domain[]
}

export type Domain = `${string}.eth`

export type Currency = {
  contract: string
  name: string
  symbol: string
  decimals: number
}

export type DomainListing = {
  url: string
  source: {
    name: string
    url: string
  }
  priceUsd: number
  price: number
  currency: Currency
}

export type TransactionStatus = 'idle' | 'commit' | 'processing'

export type CommitmentParams = {
  name: Domain
  owner: string
  duration: number
  resolver?: string
  addr?: string
  reverseRecord: boolean
}

export type RegistrationParams = CommitmentParams & {
  secret: string
  data: string[]
  commitment: string
}

// Skip resolver and addr; use single owner and secret
export type BulkRegistrationParams = {
  names: Domain[]
  owner: string
  secret: string
  commitments: string[]
}

export interface NFTToken {
  id: string
  contract: string
  tokenId: string
  kind: 'erc721' | 'erc1155'
  name: string
  image: string
  acquiredAt?: string
  collection: NFTCollection
}

export interface NFTCollection {
  id: string
  name: string
}

export type RegisterStep = 'initializing' | 'commit' | 'wait' | 'register' | 'success'
