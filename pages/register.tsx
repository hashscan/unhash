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

const Register: NextPage<RegisterProps> = (props) => {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1 style={{ marginTop: '40px' }}>
          Register <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{props.domain}</span>
        </h1>
        <div style={{ height: '1px', background: 'var(--border-2)', marginTop: '20px', marginBottom: '40px' }}></div>
        <Step {...props} />
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
      name: parseDomainName(domain)
    }
  }
}

export default Register
