import Head from 'next/head'
import { GetServerSideProps } from 'next'

import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { Domain } from 'lib/types'

interface DomainPageProps {
  domain: Domain
}

const Checkout: PageWithLayout<DomainPageProps> = ({ domain }: DomainPageProps) => {
  return (
    <>
      <Head>
        <title>{domain}</title>
      </Head>

      <h1>{domain}</h1>
      <p>
        Owner <code>0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045</code>
      </p>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as string

  return {
    props: {
      domain
    }
  }
}

Checkout.layout = <ContainerLayout />

export default Checkout
