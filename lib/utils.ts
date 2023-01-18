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
