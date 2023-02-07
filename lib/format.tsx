export function formatYears(years: number): string {
  return years === 1 ? '1 year' : `${years} years`
}

// Returns price with dollar sign and two decimal places.
// Handles undefined price.
export function formatUSDPrice(price?: number): string {
  if (!price) return ''
  const rounded = (Math.round(price * 100) / 100).toFixed(2)
  return `$${rounded}`
}
