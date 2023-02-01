import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'

import WrapBalancer from 'react-wrap-balancer'
import {
  SearchButton,
  SearchStatus,
} from 'components/DomainSearchBar/SearchButton'

import styles from 'styles/search.module.css'

interface SearchProps {}

const Search: NextPage<SearchProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <WrapBalancer>Get Your Unique .eth Domain</WrapBalancer>
        </h1>

        <h2 className={styles.heroSubtitle}>
          <WrapBalancer>
            A modern and better way of searching, buying and managing{' '}
            <b>ENS domains</b>
          </WrapBalancer>
        </h2>
      </div>

      <div className={styles.search}>
        <input
          autoFocus
          className={styles.searchInput}
          spellCheck="false"
          placeholder="Look up .eth domain..."
        ></input>

        <div className={styles.action}>
          <SearchButton status={SearchStatus.Available} />
        </div>
      </div>
    </div>
  )
}

export default Search
