import React, { useCallback, useRef } from 'react'
import WrapBalancer from 'react-wrap-balancer'

import { DomainSearchBar, SearchBarHandle } from 'components/DomainSearchBar'
import { LandingPricing } from 'components/LandingPricing/LandingPricing'
import { LandingSuggestions } from 'components/LandingSuggestions/LandingSuggestions'
import { Footer } from 'components/Footer/Footer'
import { FullWidthLayout, PageWithLayout } from 'components/layouts'

import styles from './index.module.css'
import { Suggestion } from 'components/LandingSuggestions/types'

const Search: PageWithLayout = () => {
  const searchBarRef = useRef<SearchBarHandle>(null)

  const handleSuggestionSelected = useCallback((suggestion: Suggestion) => {
    searchBarRef.current?.setSearch(suggestion.domain)
  }, [])

  return (
    <div className={styles.searchPage}>
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
              <WrapBalancer>Get Your Unique .eth Domain</WrapBalancer>
            </h1>

            <h2 className={styles.heroSubtitle}>
              <WrapBalancer>
                A modern and better way of searching, buying and managing <b>ENS domains</b>
              </WrapBalancer>
            </h2>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.searchSection}>
          <DomainSearchBar ref={searchBarRef} />
        </section>

        <section className={styles.suggestionsSection}>
          <LandingSuggestions onSuggestionSelected={handleSuggestionSelected} />
        </section>

        <section className={styles.pricingSection}>
          <LandingPricing />
        </section>
      </div>

      <Footer />
    </div>
  )
}

Search.layout = FullWidthLayout

export default Search
