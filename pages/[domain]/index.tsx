import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { Domain } from 'lib/types'
import styles from './domain.module.css'
import api, { DomainInfo } from 'lib/api'
import { validateDomain } from 'lib/utils'
import { formatAddress } from 'lib/utils'
import Link from 'next/link'

interface DomainPageProps {
  domain: Domain
  info: DomainInfo
}

// TODO: this page only works for mainnet, including Etherscanlinks
const Domain: PageWithLayout<DomainPageProps> = ({ domain, info }: DomainPageProps) => {
  return (
    <div className={styles.main}>
      <Head>
        <title>{domain}</title>
      </Head>

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
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as string
  // TODO: figure out a way to obtain current network on the server-side
  // ideas: standalone subdomain domain? cookies?
  const network = 'mainnet'

  if (validateDomain(domain)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  let domainInfo: DomainInfo
  try {
    domainInfo = await api.domainInfo(domain as Domain, network)
  } catch (e) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      domain,
      info: domainInfo
    }
  }
}

Domain.layout = <ContainerLayout verticalPadding={false} />

export default Domain