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
