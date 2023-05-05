import { StatusBadge } from 'components/ui/StatusBadge/StatusBadge'
import { ComponentProps } from 'react'
import { ens_normalize as ensNormalize } from '@adraffy/ens-normalize'
import { SearchStatus } from './types'

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

// "foo.ETH" => "foo.eth"
export const normalizeDotETH = (name: string) => name.replace(/\.eth$/i, '.eth')

//  "foo.ETH" => "foo.eth"
//  "foo.E" => "foo.e"
//  "ПРивет.Eth" => "привет.eth"
//  "🙆🏻‍♂️🙆🏻‍♂️🙆🏻‍♂️.eth" => "🙆🏻‍♂🙆🏻‍♂🙆🏻‍♂.eth"
export const normalize = (name: string) => {
  const suffix = findSuffix(name)
  const nameWithDomain = name.length ? name + suffix : ''

  try {
    // normalize
    const norm = ensNormalize(nameWithDomain)
    // remove suffix
    return norm.substring(0, norm.length - suffix.length)
  } catch {
    return name
  }
}

export const statusToLEDColor = (
  status: SearchStatus
): ComponentProps<typeof StatusBadge>['led'] => {
  switch (status) {
    case SearchStatus.Available:
      return 'success'

    case SearchStatus.Taken:
      return 'error'

    case SearchStatus.Error:
      return 'error'

    case SearchStatus.Invalid:
      return 'warning'
  }

  return 'info'
}
