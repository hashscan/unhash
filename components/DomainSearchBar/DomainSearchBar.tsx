import React, { forwardRef, useState, useImperativeHandle, useCallback } from 'react'
import { useRouter } from 'next/router'

import { SearchButton } from './SearchButton'
import styles from './DomainSearchBar.module.css'
import { useSearch } from './useSearch'
import clsx from 'clsx'

// allow parent components to imperatively update search string using ref
export interface SearchBarHandle {
  setSearch: (val: string) => void
}

const stripDotETH = (s: string) => s.replace(/\.eth$/i, '')

export const DomainSearchBar = forwardRef<SearchBarHandle, {}>(function SearchBarWithRef(
  _props,
  ref
) {
  const [searchQuery, setSearchQueryRaw] = useState('')
  const [focused, setFocused] = useState(false)

  const setSearchQuery = useCallback((val: string) => {
    setSearchQueryRaw(stripDotETH(val)) // strips .eth at the end
  }, [])

  const normalized = searchQuery.length ? searchQuery + '.eth' : ''

  const { status } = useSearch(normalized)
  const router = useRouter()

  useImperativeHandle(ref, () => ({
    setSearch(value: string) {
      setSearchQuery(value)
    }
  }))

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputWithSuffix}>
        <input
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
          spellCheck="false"
          placeholder="Look up .eth domain..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        ></input>

        <div className={clsx(styles.suffix, { [styles.suffixVisible]: searchQuery.length !== 0 })}>
          {searchQuery}
          <span>.eth</span>
        </div>
      </div>

      <div className={styles.action}>
        <SearchButton
          focused={focused}
          status={status}
          onClick={() => {
            router.push(`/checkout?domain=${searchQuery}`)
          }}
        />
      </div>
    </div>
  )
})
