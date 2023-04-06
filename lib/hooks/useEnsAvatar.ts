import { AvatarResolver } from '@ensdomains/ens-avatar'
import { useQuery } from '@tanstack/react-query'
import useEvent from 'react-use-event-hook'

import { Domain } from 'lib/types'
import { useChainId, useProvider } from 'wagmi'

/**
 * Like useEnsAvatar from wagmi, but relies on a slightly effective @ensdomains/ens-avatar
 * @param domain
 * @returns
 */
export const useEnsAvatar = (domain: Domain) => {
  const chainId = useChainId()
  const provider = useProvider({ chainId })

  const queryFn = useEvent(async (opts) => {
    const [domain] = opts.queryKey

    const resolver = new AvatarResolver(provider)
    const src = await resolver.getAvatar(domain, {})

    return src
  })

  return useQuery({
    queryKey: [domain],
    queryFn,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })
}
