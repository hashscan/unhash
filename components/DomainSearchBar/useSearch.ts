import api from 'lib/api'
import { toNetwork } from 'lib/types'
import { validateDomain } from 'lib/utils'
import { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { useChainId } from 'wagmi'

import { SearchStatus } from './types'
import { useLatestPromise } from './useLatestPromise'

export interface SearchResult {
  status: SearchStatus
  errorMessage?: string
  validationMessage?: string
}

export const useSearch = (query: string) => {
  const chainId = useChainId()

  const [result, setResult] = useState<SearchResult>({ status: SearchStatus.Idle })
  const { run, cancel } = useLatestPromise<boolean>()
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

    const validationMessage = validateDomain(debouncedQuery)

    if (validationMessage) {
      setResult({ status: SearchStatus.Invalid, validationMessage })
      return
    }

    const fetchAvailability = async () => {
      setResult({ status: SearchStatus.Loading })

      try {
        const available = await run(api.checkDomain(debouncedQuery, toNetwork(chainId)))

        setResult({ status: available ? SearchStatus.Available : SearchStatus.NotAvailable })
      } catch (err) {
        setResult({ status: SearchStatus.Error, errorMessage: String(err) })
      }
    }

    fetchAvailability()
  }, [debouncedQuery, chainId, run])

  return result
}
