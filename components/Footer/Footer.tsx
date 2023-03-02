import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.appName}>xens.app</div>

      {/*
        What really this part of the footer should contain? Links!

        Links to our own content pages that are important for the SEO, for example
        "Get .eth domain" or "What is .eth?" (these are real Google
        search queries that are currently raising popularity)

        We can also add links to some popular .eth names, e.g. vitalik.eth or jack.eth
        (they appear in Google Trends as well)
      */}
      <div className={styles.links}>
        we run on top of <a href="https://docs.ens.domains/">Etherium Name Service↗</a>
      </div>

      {/* Other ideas: gas price, current block, number of .ETH registered in 24h... */}
    </footer>
  )
}
