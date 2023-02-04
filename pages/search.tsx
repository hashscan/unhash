import React from 'react'
import WrapBalancer from 'react-wrap-balancer'
import { DomainSearchBar } from 'components/DomainSearchBar'
import styles from 'styles/search.module.css'

import { LandingPricing } from 'components/LandingPricing/LandingPricing'

const Search = () => {
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

      <div className={styles.container}>
        <section className={styles.searchSection}>
          <DomainSearchBar />
        </section>

        <section className={styles.pricingSection}>
          <LandingPricing />
        </section>
      </div>
    </>
  )
}

export default Search
