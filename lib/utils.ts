import { Domain } from './types'

export function formatAddress(address: string): string {
  const leadingChars = 6
  const trailingChars = 4

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(address.length - trailingChars)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/** 
 * A function to generate secret for commit transaction. 
 * It uses Web Crypto API.
 */
export function generateCommitSecret() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return `0x${Array.from(bytes)
    .map((p) => p.toString(16).padStart(2, '0'))
    .join('')}`
}

/** Returns error message or null if domain valid. */
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
  return domain.substring(0, domain.indexOf('.eth'))
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}