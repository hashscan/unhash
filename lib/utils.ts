export function formatAddress(address: string): string {
  const leadingChars = 6
  const trailingChars = 4

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(address.length - trailingChars)}`
}

export const randomSecret = () => {
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