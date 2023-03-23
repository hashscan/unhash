import Link from 'next/link'

import { Domain } from 'lib/types'
import { DomainInfo } from 'lib/api'
import { formatAddress } from 'lib/utils'
import styles from './TechInfo.module.css'

interface DomainPageProps {
  domain: Domain
  info: DomainInfo
}

export const TechInfo = ({ domain, info }: DomainPageProps) => (
  <div className={styles.main}>
    <div className={styles.title}>{domain}</div>
    <div className={styles.address}>{formatAddress(info.registrant as Domain, 4)}</div>
    <div className={styles.info}>
      This domain is owned by{' '}
      <Link
        className={styles.link}
        href={`https://etherscan.io/address/${info.registrant}`}
        target="_blank"
      >
        {formatAddress(info.registrant as Domain, 4)}
      </Link>
      {info.addrRecords.ethereum ? (
        <>
          {' '}
          and points to{' '}
          <Link
            className={styles.link}
            href={`https://etherscan.io/address/${info.addrRecords.ethereum}`}
            target="_blank"
          >
            {formatAddress(info.addrRecords.ethereum, 4)}
          </Link>{' '}
          address.
        </>
      ) : (
        '.'
      )}
    </div>
  </div>
)
