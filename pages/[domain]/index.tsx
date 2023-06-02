import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { Domain, currentNetwork } from 'lib/types'
import styles from './domain.module.css'
import api, { DomainInfo } from 'lib/api'
import { validateDomain } from 'lib/utils'
import { Profile } from 'components/Profile/Profile'

interface DomainPageProps {
  domain: Domain
  info: DomainInfo
}

const Domain: PageWithLayout<DomainPageProps> = ({ domain, info }: DomainPageProps) => {
  return (
    <div className={styles.main}>
      <Head>
        <title>{domain} | unhash</title>
      </Head>

      <Profile domain={domain} info={info} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  const domain = query.domain as string
  const network = currentNetwork()

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

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600')

  return {
    props: {
      domain,
      info: domainInfo
    }
  }
}

Domain.layout = <ContainerLayout verticalPadding={false} />

export default Domain
