import { Nav } from 'components/Nav'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
import { parseDomainName, validateDomain } from 'lib/utils'
import styles from 'styles/register.module.css'

const Step = dynamic(() => import('components/Step').then((m) => m.Step), {
  ssr: false,
  loading: () => <div>loading...</div>
})

interface RegisterProps {
  domain: string
  name: string
}

const Register: NextPage<RegisterProps> = (props: RegisterProps) => {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1>Domain registration</h1>
        <div>{'Commit -> Wait a minute -> Register'}</div>
        <h2>{props.domain}</h2>
        <Step {...{
          domain: props.domain,
          name: props.name
        }} />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as string

  // validate domain query on server side
  const e = validateDomain(domain)
  if (e) {
    return {
      redirect: {
        permanent: true,
        destination: '/'
      }
    }
  }

  return {
    props: {
      domain: domain,
      name: parseDomainName(domain),
    }
  }
}

export default Register
