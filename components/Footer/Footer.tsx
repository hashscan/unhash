import styles from './Footer.module.css'
import { UnhashLogo } from 'components/icons'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.appName}>
        <span className={styles.logo}>
          <UnhashLogo size="16px" fillColor="var(--color-slate-1)" />
        </span>
        unhash.com
      </div>

      {/*
        What really this part of the footer should contain? Links!

        Links to our own content pages that are important for the SEO, for example
        "Get .eth domain" or "What is .eth?" (these are real Google
        search queries that are currently raising popularity)

        We can also add links to some popular .eth names, e.g. vitalik.eth or jack.eth
        (they appear in Google Trends as well)
      */}
      <div className={styles.links}>
        Follow Unhash on <a href="https://twitter.com/unhashcom">Twitter ↗</a>
        {/* uncomment when we get a Telegram handle */}
        {false && (
          <>
            {' '}
            and <a href="https://t.me/unhash">Telegram ↗</a>
          </>
        )}
      </div>

      {/* Other ideas: gas price, current block, number of .ETH registered in 24h... */}
    </footer>
  )
}
