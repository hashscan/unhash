import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useCallback,
  FormEventHandler
} from 'react'

import { SearchButton } from './SearchButton'
import styles from './DomainSearchBar.module.css'
import { useSearch } from './useSearch'
import clsx from 'clsx'
import { useRouterNavigate } from 'lib/hooks/useRouterNavigate'
import { SearchStatus } from './types'

import { normalizeDotETH, findSuffix } from './utils'

// allow parent components to imperatively update search string using ref
export interface SearchBarHandle {
  setSearch: (val: string) => void
}

export const DomainSearchBar = forwardRef<SearchBarHandle, {}>(function SearchBarWithRef(
  _props,
  ref
) {
  const [searchQuery, setSearchQueryRaw] = useState('')
  const [, setIsFocused] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const setSearchQuery = useCallback((val: string) => {
    setSearchQueryRaw(normalizeDotETH(val))
  }, [])

  const suffix = findSuffix(searchQuery)
  const normalized = searchQuery.length ? normalizeDotETH(searchQuery + suffix) : ''

  const { status } = useSearch(normalized)
  const navigate = useRouterNavigate()

  const registerDomain = useCallback(() => {
    if (isNavigating || status !== SearchStatus.Available) return

    setIsNavigating(true)

    navigate(`/checkout?domain=${normalized}`).finally(() => {
      setIsNavigating(false)
    })
  }, [isNavigating, navigate, normalized, status])

  const handleSubmit: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault()
      registerDomain()
    },
    [registerDomain]
  )

  useImperativeHandle(ref, () => ({
    setSearch(value: string) {
      setSearchQuery(value)
    }
  }))

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputWithSuffix}>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.input}
            spellCheck="false"
            placeholder="Look up .eth domain..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          ></input>
        </form>

        <div className={clsx(styles.suffix, { [styles.suffixVisible]: searchQuery.length !== 0 })}>
          {searchQuery}
          <span>{suffix}</span>
        </div>
      </div>

      <div className={styles.action}>
        <SearchButton status={status} isNavigating={isNavigating} onClick={registerDomain} />
      </div>
    </div>
  )
})
