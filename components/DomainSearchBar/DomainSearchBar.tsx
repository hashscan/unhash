import React, { useEffect, useState } from 'react'

import { SearchButton, SearchStatus } from './SearchButton'
import styles from './DomainSearchBar.module.css'

interface SearchProps {}

export const DomainSearchBar = (props: SearchProps) => {
  return (
    <div className={styles.searchBar}>
      <input
        autoFocus
        className={styles.input}
        spellCheck="false"
        placeholder="Look up .eth domain..."
      ></input>

      <div className={styles.action}>
        <SearchButton status={SearchStatus.Available} />
      </div>
    </div>
  )
}
