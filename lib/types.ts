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
  registeredAt?: number
  expiresAt?: number
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
