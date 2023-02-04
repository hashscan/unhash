import styles from './LandingPricing.module.css'

export const LandingPricing = () => {
  return (
    <div className={styles.pricing}>
      <div className={styles.texts}>
        <h2 className={styles.header}>
          How much does it cost to register an&nbsp;.ETH domain?
        </h2>

        <div className={styles.explainer}>
          The base price is determined by the length of the name and the
          registration period, plus the Ethereum network fees.
        </div>
      </div>

      {/* rhs */}
      <div className={styles.info}>
        <table className={styles.table}>
          <tr>
            <td>
              <span className={styles.price}>
                $5
                <small> / year</small>
              </span>
            </td>
            <td>5+ character names</td>
          </tr>

          <tr>
            <td>
              <span className={styles.price}>
                $160<small> / year</small>
              </span>
            </td>
            <td>
              4 character names, e.g.{' '}
              <a
                href="https://nick.eth.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                nick.eth
              </a>
            </td>
          </tr>

          <tr>
            <td>
              <span className={styles.price}>
                $640<sup>*</sup>
                <small> / year</small>
              </span>
            </td>
            <td>
              3 character names, e.g.{' '}
              <a
                href="https://isc.eth.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                isc.eth
              </a>
            </td>
          </tr>
        </table>

        <div className={styles.subnote}>
          <sup>*</sup> Domain renewal fee is automatically converted to ETH on
          the time of the transaction.
        </div>
      </div>
    </div>
  )
}
