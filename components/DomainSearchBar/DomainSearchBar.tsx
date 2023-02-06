import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle
} from 'react'

import { SearchButton, SearchStatus } from './SearchButton'
import styles from './DomainSearchBar.module.css'
import api from 'lib/api'
import { useChainId } from 'wagmi'
import { validateDomain } from 'lib/utils'
import { useDebounce } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { toNetwork } from 'lib/types'

// allow parent components to imperatively update search string using ref
export interface SearchBarHandle {
  setSearch: (val: string) => void
}

export const DomainSearchBar = forwardRef<SearchBarHandle, {}>(
  function SearchBarWithRef(_props, ref) {
    const [searchQuery, setSearchQuery] = useState('')
    const [status, setStatus] = useState(SearchStatus.Loading)
    const chainId = useChainId()

    const domainInput = useDebounce(searchQuery, 300)

    const router = useRouter()

    useImperativeHandle(ref, () => ({
      setSearch(value: string) {
        setSearchQuery(value)
      }
    }))

    useEffect(() => {
      if (domainInput.length === 0) {
        setStatus(SearchStatus.Inactive)
        return
      }
      // TODO: setStatus Invalid?
      if (validateDomain(domainInput)) return

      const check = async () => {
        setStatus(SearchStatus.Loading)
        // TODO: catch api errors
        const available = await api.checkDomain(
          domainInput,
          toNetwork(chainId)
        )
        setStatus(available ? SearchStatus.Available : SearchStatus.NotAvailable)
      }
      check()
    }, [domainInput, chainId])

    return (
      <div className={styles.searchBar}>
        <input
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
          spellCheck="false"
          placeholder="Look up .eth domain..."
        ></input>

        <div className={styles.action}>
          <SearchButton
            status={status}
            onClick={() => {
              router.push(`/checkout?domain=${searchQuery}`)
            }}
          />
        </div>
      </div>
    )
  }
)
