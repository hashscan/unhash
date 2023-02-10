import { StatusBadge } from 'components/ui/StatusBadge/StatusBadge'
import { ComponentProps } from 'react'
import { SearchStatus } from './types'

// "foo.ETH" => "foo.eth"
export const normalizeDotETH = (s: string) => s.replace(/\.eth$/i, '.eth')

// "bar.et" => "h"
// "bax." => "eth"
export const findSuffix = (s: string, suffix = '.eth') => {
  const source = s.toLowerCase()

  for (let i = 0; i <= suffix.length; ++i) {
    const lhs = suffix.slice(0, i + 1)
    const rhs = suffix.slice(i + 1)

    if (source.endsWith(lhs)) return rhs
  }

  return suffix
}

export const statusToLEDColor = (
  status: SearchStatus
): ComponentProps<typeof StatusBadge>['led'] => {
  switch (status) {
    case SearchStatus.Available:
      return 'success'

    case SearchStatus.NotAvailable:
      return 'error'

    case SearchStatus.Error:
      return 'error'

    case SearchStatus.Invalid:
      return 'warning'
  }

  return 'info'
}
