import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WarningLabel } from 'components/WarningLabel/WarningLabel'
import api, { DomainInfo } from 'lib/api'
import { currentNetwork, Domain } from 'lib/types'
import { formatAddress } from 'lib/utils'
import styles from './profile.module.css'
import { Metadata } from 'next'

// cache for 30 minutes
export const revalidate = 1800

const getNameInfo = cache(async (name: Domain) => {
  const network = currentNetwork()
  return await api.domainInfo(name as Domain, network)
})

type ProfileParams = { params: { name: Domain } }

function Profile({ info, name }: { info: DomainInfo; name: Domain }) {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>
        {name} <WarningLabel name={name} size={'lg'}></WarningLabel>
      </h1>
      <div className={styles.address}>{formatAddress(info.owner as Domain, 4)}</div>
      <div className={styles.info}>
        This domain is owned by{' '}
        <Link
          className={styles.link}
          href={`https://etherscan.io/address/${info.owner}`}
          target="_blank"
        >
          {formatAddress(info.owner as Domain, 4)}
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

export async function generateMetadata({ params }: ProfileParams) {
  const isProduction = !!process.env.NEXT_PUBLIC_PRODUCTION_URL
  const profile = await getNameInfo(params.name)

  if (!profile) {
    notFound()
  }

  const name = profile.textRecords.name ?? params.name

  const metadata: Metadata = {
    title: `${name} Profile`,
    description: profile.textRecords.description ?? `Default description for ${name}`,
    keywords: [],

    robots: isProduction ? 'index, follow' : 'noindex, nofollow',

    referrer: 'origin',
    icons: '/favicon.svg'

    // TODO: add oopen graph image and twitter card
    // openGraph: {
    //   type: 'website',
    //   url: `${hostname}/how-tos/${post.slug}`,
    //   title: post.title,
    //   description: post.description,
    //   images: [
    //     {
    //       url: 'og-preview.jpg'
    //     }
    //   ]
    // },

    // twitter: {
    //   card: 'summary_large_image',
    //   title: post.title,
    //   description: post.description,
    //   images: 'og-preview.jpg'
    // }
  }

  return metadata
}

export default async function ProfilePage({ params }: ProfileParams) {
  const profile = await getNameInfo(params.name)

  if (!profile) {
    notFound()
  }

  return <Profile info={profile} name={params.name} />
}

/*

import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { Domain, currentNetwork } from 'lib/types'
import styles from './domain.module.css'
import api, { DomainInfo } from 'lib/api'
import { validateDomain } from 'lib/utils'
import { formatAddress } from 'lib/utils'
import Link from 'next/link'
import { WarningLabel } from 'components/WarningLabel/WarningLabel'

interface DomainPageProps {
  domain: Domain
  info: DomainInfo
}

// TODO: this page only works for mainnet, including Etherscanlinks
const Domain: PageWithLayout<DomainPageProps> = ({ domain, info }: DomainPageProps) => {
  return (
    
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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

  return {
    props: {
      domain,
      info: domainInfo
    }
  }
}

Domain.layout = <ContainerLayout verticalPadding={false} />

export default Domain

 */
