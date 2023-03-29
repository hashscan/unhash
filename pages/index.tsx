import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import WrapBalancer from 'react-wrap-balancer'

import { DomainSearchBar, SearchBarHandle } from 'components/DomainSearchBar/DomainSearchBar'
import { LandingPricing } from 'components/LandingPricing/LandingPricing'
import { LandingSuggestions } from 'components/LandingSuggestions/LandingSuggestions'
import { Footer } from 'components/Footer/Footer'
import { Button } from 'components/ui/Button/Button'
import { FullWidthLayout, PageWithLayout } from 'components/layouts'

import styles from './index.module.css'
import { Suggestion } from 'components/LandingSuggestions/types'

import { useRegistration } from 'lib/hooks/useRegistration'

import { trackGoal } from 'lib/analytics'

import domainCardImg from '../styles/assets/explainer-domains.png'
import walletCardImg from '../styles/assets/explainer-wallet.png'
import profileCardImg from '../styles/assets/explainer-profile.png'

const Search: PageWithLayout = () => {
  const { registration: reg, cancel } = useRegistration()
  const [isModalOpen, show] = useState(false)

  useEffect(() => {
    if (reg) {
      if (reg.status === 'registered') {
        // remove previous registration if it finished
        cancel()
      } else {
        // show warning otherwise
        show(true)
      }
    }
  }, [cancel, reg])

  const searchBarRef = useRef<SearchBarHandle>(null)

  const handleSuggestionSelected = useCallback((suggestion: Suggestion) => {
    trackGoal('SuggestionClick', { props: { domain: suggestion.domain } })
    searchBarRef.current?.setSearch(suggestion.domain)
  }, [])

  return (
    <>
      {/* TODO: real modal modal modal */}
      {isModalOpen && (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              cancel()
              show(false)
            }}
          >
            start new registration
          </Button>

          <Link href={`/${reg?.names[0]}/register`}>continue registration</Link>
        </>
      )}
      <div className={styles.searchPage}>
        <div className={styles.heroSection}>
          <div className={styles.heroLayout}>
            <div className={styles.hero}>
              <span className={styles.versionLabel}>Pre-Beta</span>

              <h1 className={styles.heroTitle}>
                <WrapBalancer>Register and configure .eth domains</WrapBalancer>
              </h1>

              <h2 className={styles.heroSubtitle}>
                <WrapBalancer>
                  A no-pain way of buying an ENS domain, linking it to your wallet and setting up a
                  public profile.
                </WrapBalancer>
              </h2>

              <div className={styles.searchBar}>
                <DomainSearchBar ref={searchBarRef} />
              </div>
            </div>

            <LandingSuggestions onSuggestionSelected={handleSuggestionSelected} />
          </div>
        </div>

        <div className={styles.explainerSection}>
          <div className={styles.container}>
            <div className={styles.explainerGrid}>
              <div className={styles.explainerCard}>
                <div className={styles.explainerImgFade}>
                  <Image src={domainCardImg} alt="What is an ENS domain?" />
                </div>

                <div className={styles.explainerHeader}>ENS Domain</div>

                <div className={styles.explainerText}>
                  It&apos;s a human-readable username that can point to an Ethereum wallet. These
                  domains are essentially NFTs that you can own, transfer, sell and fully control.
                </div>
              </div>

              <div className={styles.explainerCard}>
                <div className={styles.explainerImgFade}>
                  <Image src={walletCardImg} alt="How to link your wallet to ENS name" />
                </div>
                <div className={styles.explainerHeader}>Wallet Linking</div>

                <div className={styles.explainerText}>
                  Once a domain is linked to your wallet, it becomes much easier for other users to
                  find you and use Web3 apps where ENS is well adopted.
                </div>
              </div>

              <div className={styles.explainerCard}>
                <div className={styles.explainerImgFade}>
                  <Image
                    src={profileCardImg}
                    alt="You can set up a public profile associated with your wallet and ENS name"
                  />
                </div>

                <div className={styles.explainerHeader}>Public Profile</div>

                <div className={styles.explainerText}>
                  After obtaining an ENS domain, make sure to fill out your profile with your
                  website, Twitter handle, avatar, and anything else that gives your wallet a
                  personal touch.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.pricingSection}>
          <div className={styles.container}>
            <LandingPricing />
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

Search.layout = FullWidthLayout

export default Search
