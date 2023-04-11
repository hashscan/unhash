import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import WrapBalancer from 'react-wrap-balancer'

import { DomainSearchBar, SearchBarHandle } from 'components/DomainSearchBar/DomainSearchBar'
import { LandingPricing } from 'components/LandingPricing/LandingPricing'
import { LandingSuggestions } from 'components/LandingSuggestions/LandingSuggestions'
import { Footer } from 'components/Footer/Footer'
import { UnfinishedRegistration } from 'components/UnfinishedRegistration/UnfinishedRegistration'
import { FullWidthLayout, PageWithLayout } from 'components/layouts'

import styles from './index.module.css'
import { Suggestion } from 'components/LandingSuggestions/types'

import { trackGoal } from 'lib/analytics'

import domainCardImg from '../styles/assets/explainer-domains.png'
import walletCardImg from '../styles/assets/explainer-wallet.png'
import profileCardImg from '../styles/assets/explainer-profile.png'

import { SlideFlap } from 'components/ui/SlideFlap/SlideFlap'

import clsx from 'clsx'
import { PlusSign } from 'components/icons'

/**
 * Extract separate component
 */
const BulkStatus = () => {
  const [bulkEnabled, setBulkEnabled] = useState(false)
  const [domainsSelected, setDomainsSelected] = useState<number>(0)

  const domains = ['mlfrg.eth', 'lucian.eth', 'smaragda.eth', 'unstoppable.eth']

  const domainsToDisplay = domains.slice(0, domainsSelected).reverse().slice(0, 3)
  const remaining = Math.max(0, domainsSelected - domainsToDisplay.length)

  const handleClick = () => {
    if (!bulkEnabled) {
      setBulkEnabled(true)
    } else {
      if (domainsSelected >= 4) {
        setBulkEnabled(false)
        setDomainsSelected(0)
      } else {
        setDomainsSelected(domainsSelected + 1)
      }
    }
  }

  return (
    <div className={clsx(styles.bulkStatus, { [styles.bulkStatus_enabled]: bulkEnabled })}>
      <div className={styles.statusWithIcon} onClick={handleClick}>
        <div className={styles.enableBulk}>
          <PlusSign />
        </div>

        <SlideFlap flipKey={`${bulkEnabled}-${domainsSelected}`} slotClassName={styles.second}>
          {/* Bulk mode disabled */}
          {!bulkEnabled && <>Bulk Register</>}

          {/* Cart is empty */}
          {bulkEnabled && domainsSelected === 0 && (
            <span className={styles.label}>Use search to add names to your order</span>
          )}

          {/* Cart has names */}
          {bulkEnabled && domainsSelected > 0 && (
            <>
              <span className={styles.label}>Selected </span>
              {domainsToDisplay.join(', ')}
              {remaining > 0 && <span className={styles.label}> and {remaining} more</span>}
            </>
          )}
        </SlideFlap>
      </div>

      {/* <div className={styles.register}>Register</div> */}
    </div>
  )
}

const Search: PageWithLayout = () => {
  const searchBarRef = useRef<SearchBarHandle>(null)

  const handleSuggestionSelected = useCallback((suggestion: Suggestion) => {
    trackGoal('SuggestionClick', { props: { domain: suggestion.domain } })
    searchBarRef.current?.setSearch(suggestion.domain)
  }, [])

  return (
    <>
      <UnfinishedRegistration />

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
                <BulkStatus />
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
