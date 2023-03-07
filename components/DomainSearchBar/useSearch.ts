import api, { DomainStatus } from 'lib/api'
import { DomainListing, toNetwork } from 'lib/types'
import { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { useChainId } from 'wagmi'

import { SearchStatus } from './types'
import { useLatestPromise } from './useLatestPromise'

export interface SearchResult {
  status: SearchStatus
  listing?: DomainListing
  errorMessage?: string
  validationMessage?: string
}

export const useSearch = (query: string, withListing: boolean = false) => {
  const chainId = useChainId()

  const [result, setResult] = useState<SearchResult>({ status: SearchStatus.Idle })
  const { run, cancel } = useLatestPromise<DomainStatus>()
  const debouncedQuery = useDebounce(query, 300)

  // query changes -> cancel everything and start loading
  useEffect(() => {
    cancel()

    if (query.length === 0) {
      setResult({ status: SearchStatus.Idle })
    } else {
      setResult({ status: SearchStatus.Loading })
    }
  }, [query, cancel])

  // debounced query changes -> initiate new request and cancel the old one
  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setResult({ status: SearchStatus.Idle })
      return
    }

    const fetchAvailability = async () => {
      setResult({ status: SearchStatus.Loading })

      try {
        const { isValid, isAvailable, validationMessage, listing } = await run(
          api.checkDomain(debouncedQuery, toNetwork(chainId), withListing)
        )

        if (!isValid) {
          setResult({
            status: SearchStatus.Invalid,
            validationMessage
          })
        } else {
          setResult({
            status: isAvailable ? SearchStatus.Available : SearchStatus.NotAvailable,
            listing: listing
          })
        }
      } catch (err) {
        setResult({ status: SearchStatus.Error, errorMessage: String(err) })
      }
    }

    fetchAvailability()
  }, [debouncedQuery, chainId, withListing, run])

  return result
}
