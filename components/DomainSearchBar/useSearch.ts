import api, { DomainStatus } from 'lib/api'
import { DomainListing } from 'lib/types'
import { useEffect, useState, useRef } from 'react'
import { useDebounce } from 'usehooks-ts'
import { SearchStatus } from './types'
import { useLatestPromise } from './useLatestPromise'

export interface SearchResult {
  status: SearchStatus
  listing?: DomainListing
  errorMessage?: string
  validationMessage?: string
}

const EMPTY_ARRAY = [] as string[]
export const useSearch = (
  query: string,
  withListing: boolean = false,
  names: string[] = EMPTY_ARRAY
) => {
  const [result, setResult] = useState<SearchResult>({ status: SearchStatus.Idle })
  const { run, cancel } = useLatestPromise<DomainStatus>()
  const debouncedQuery = useDebounce(query, 300)

  const namesRef = useRef<string[]>([])

  useEffect(() => {
    namesRef.current = names
  }, [names])

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
          api.checkDomain(debouncedQuery, withListing)
        )

        if (!isValid) {
          setResult({
            status: SearchStatus.Invalid,
            validationMessage
          })
        } else if (namesRef.current.includes(debouncedQuery)) {
          setResult({
            status: SearchStatus.Duplicate,
            listing: listing
          })
        } else {
          setResult({
            status: isAvailable ? SearchStatus.Available : SearchStatus.Taken,
            listing: listing
          })
        }
      } catch (err) {
        setResult({ status: SearchStatus.Error, errorMessage: String(err) })
      }
    }

    fetchAvailability()
  }, [debouncedQuery, withListing, run])

  return result
}
