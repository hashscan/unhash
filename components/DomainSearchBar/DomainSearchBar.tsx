import React, { useEffect, useState } from 'react'

import { SearchButton, SearchStatus } from './SearchButton'
import styles from './DomainSearchBar.module.css'

interface SearchProps {}

export const DomainSearchBar = (props: SearchProps) => {
  /**
   * TODO: this is just a naive mock implementation
   */
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState(SearchStatus.Loading)

  useEffect(() => {
    if (searchQuery.length === 0) {
      setStatus(SearchStatus.Inactive)
    } else if (searchQuery.length < 7) {
      setStatus(SearchStatus.Loading)
    } else {
      setStatus(SearchStatus.Available)
    }
  }, [searchQuery])

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
        <SearchButton status={status} />
      </div>
    </div>
  )
}
