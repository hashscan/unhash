import { ens_normalize as ensNormalize, ens_split as ensSplit } from '@adraffy/ens-normalize'
import { Domain, NFTToken, TransactionStatus } from './types'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function formatAddress(address: string, displayLength: number = 4): string {
  const leadingChars = 2 + displayLength
  const trailingChars = displayLength

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
        address.length - trailingChars
      )}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/**
 * Returns error message or null if domain valid.
 */
export function validateDomain(domain: string): string | null {
  if (!domain.endsWith('.eth')) {
    return 'Domain must end with .eth'
  }
  if (domain.split('.').length !== 2) {
    return 'Domain must not have subdomains'
  }
  if (domain.split('.')[0].length < 3) {
    return 'Domain name must be at least 3 characters long'
  }
  return null
}

/**
 * Returns first component of domain as domain name.
 * A domain must be valid according to {@link validateDomain}.
 */
export function parseDomainName(domain: string): string {
  if (validateDomain(domain)) throw Error('Invalid domain')
  return domain.split('.')[0]
}

/**
 * Returns domain name from domain.
 * Should only be used for valid domains.
 */
export function getDomainName(domain: Domain): string {
  return domain.replace(/\.eth$/i, '')
}

/**
 * Formats an ENS record avatar string
 */
const ALLOWED_ERCs = ['erc721', 'erc1155'] as const

export const nftToAvatarRecord = (avatar: NFTToken) => {
  console.assert(
    ALLOWED_ERCs.includes(avatar.kind),
    `ENS only supports ${ALLOWED_ERCs.join(', ')} avatars at the moment`
  )

  return `eip155:1/${avatar.kind}:${avatar.contract}/${avatar.tokenId}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function loadingToStatus(
  isWriteLoading: boolean,
  isWaitLoading: boolean
): TransactionStatus {
  if (!isWriteLoading && !isWaitLoading) return 'idle'
  if (isWriteLoading) return 'commit'
  if (isWaitLoading) return 'processing'
  return 'idle'
}

export function notNull<T>(val: T): val is NonNullable<T> {
  return !!val
}

export function isValidName(name: string) {
  try {
    return ensNormalize(name) === name
  } catch (error) {
    return false
  }
}

export function isNameASCIIOnly(name: string) {
  const tokens = ensSplit(name)
  return tokens.every((token) => token.type === 'ASCII')
}
