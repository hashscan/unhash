import React, { forwardRef, useState, useImperativeHandle } from 'react'
import { useRouter } from 'next/router'

import { SearchButton } from './SearchButton'
import styles from './DomainSearchBar.module.css'
import { useSearch } from './useSearch'

// allow parent components to imperatively update search string using ref
export interface SearchBarHandle {
  setSearch: (val: string) => void
}

export const DomainSearchBar = forwardRef<SearchBarHandle, {}>(function SearchBarWithRef(
  _props,
  ref
) {
  const [searchQuery, setSearchQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const { status } = useSearch(searchQuery)
  const router = useRouter()

  useImperativeHandle(ref, () => ({
    setSearch(value: string) {
      setSearchQuery(value)
    }
  }))

  return (
    <div className={styles.searchBar}>
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
