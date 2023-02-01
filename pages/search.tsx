import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'

import WrapBalancer from 'react-wrap-balancer'
import { DomainSearchBar } from 'components/DomainSearchBar'

import styles from 'styles/search.module.css'

interface SearchProps {}

const Search: NextPage<SearchProps> = (props) => {
  return (
    <>
      <div className={styles.heroSection}>
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
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.container}>
          <DomainSearchBar />
        </div>
      </div>
    </>
  )
}

export default Search
