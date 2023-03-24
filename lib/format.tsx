import { pluralize } from './pluralize'

export function formatYears(years: number): string {
  return years === 1 ? '1 year' : `${years} years`
}

// Returns price with dollar sign and two decimal places.
// Handles undefined price.
export function formatUSDPrice(price?: number, withDecimals: boolean = true): string {
  if (!price) return ''
  const rounded = (Math.round(price * 100) / 100).toFixed(withDecimals ? 2 : 0)
  return `$${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export function formatNetworkFee(fee?: number): string {
  if (!fee) return ''
  const rounded = (Math.round(fee * 100) / 100).toFixed(2)
  return `~$${rounded}`
}

export function formatExpiresIn(expiresAt: number): string {
  const now = new Date()
  const expires = new Date(expiresAt * 1000)
  const diff = expires.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const years = Math.floor(days / 365)
  if (years > 0) return pluralize('year', years)
  return pluralize('day', days)
}

export function formatExpiresOn(expiresAt: number): string {
  const expires = new Date(expiresAt * 1000)
  return expires.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
