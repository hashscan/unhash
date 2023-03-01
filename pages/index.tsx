import React, { useCallback, useRef } from 'react'
import WrapBalancer from 'react-wrap-balancer'

import { DomainSearchBar, SearchBarHandle } from 'components/DomainSearchBar/DomainSearchBar'
import { LandingPricing } from 'components/LandingPricing/LandingPricing'
import { LandingSuggestions } from 'components/LandingSuggestions/LandingSuggestions'
import { Footer } from 'components/Footer/Footer'
import { FullWidthLayout, PageWithLayout } from 'components/layouts'

import styles from './index.module.css'
import { Suggestion } from 'components/LandingSuggestions/types'

import { trackGoal } from 'lib/analytics'

const Search: PageWithLayout = () => {
  const searchBarRef = useRef<SearchBarHandle>(null)

  const handleSuggestionSelected = useCallback((suggestion: Suggestion) => {
    trackGoal('SuggestionClick', { props: { domain: suggestion.domain } })
    searchBarRef.current?.setSearch(suggestion.domain)
  }, [])

  return (
    <div className={styles.searchPage}>
      <div className={styles.heroSection}>
        <div className={styles.heroLayout}>
          <div className={styles.hero}>
            <span className={styles.versionLabel}>Pre-Beta</span>

            <h1 className={styles.heroTitle}>
              <WrapBalancer>Regsiter and configure .eth domains</WrapBalancer>
            </h1>

            <h2 className={styles.heroSubtitle}>
              <WrapBalancer>
                A no-pain way to buy ENS domain, link it to your wallet, and set up public profile.
              </WrapBalancer>
            </h2>

            <div className={styles.searchBar}>
              <DomainSearchBar ref={searchBarRef} />
            </div>
          </div>

          <LandingSuggestions onSuggestionSelected={handleSuggestionSelected} />
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.pricingSection}>
          <LandingPricing />
        </div>
      </div>

      <Footer />
    </div>
  )
}

Search.layout = FullWidthLayout

export default Search
