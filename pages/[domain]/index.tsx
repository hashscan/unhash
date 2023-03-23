/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { FullWidthLayout, PageWithLayout } from 'components/layouts'
import { SocialProfile } from 'components/SocialProfile/SocialProfile'
import { TechInfo } from 'components/TechInfo/TechInfo'

import { Domain } from 'lib/types'
import api, { DomainInfo } from 'lib/api'
import { validateDomain } from 'lib/utils'

interface DomainPageProps {
  domain: Domain
  info: DomainInfo
}

const Domain: PageWithLayout<DomainPageProps> = (props: DomainPageProps) => {
  const { domain, info } = props

  return (
    <>
      <Head>
        <title>{domain}</title>
      </Head>

      {!!Object.keys(info.textRecords).length && <SocialProfile {...props} />}

      <TechInfo {...props} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as Domain
  // const network = currentNetwork()

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
    domainInfo = await api.domainInfo(domain)
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

Domain.layout = FullWidthLayout

export default Domain
