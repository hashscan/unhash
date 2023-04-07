import { useQuery } from '@tanstack/react-query'
import useEvent from 'react-use-event-hook'

import { Domain } from 'lib/types'
import { useChainId, useProvider } from 'wagmi'

// split ens-avatar into a separate chunk
type EnsAvatarImportType = typeof import('@ensdomains/ens-avatar')
const loadEnsAvatarModule = (): Promise<EnsAvatarImportType> => import('@ensdomains/ens-avatar')

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

    const { AvatarResolver } = await loadEnsAvatarModule()

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
