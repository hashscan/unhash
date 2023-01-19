import { Nav } from 'components/Nav'

import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import styles from 'styles/register.module.css'

const Step = dynamic(() => import('components/Step').then((m) => m.Step), {
  ssr: false,
  loading: () => <div>loading...</div>
})

const Register = () => {
  const router = useRouter()
  const { domain: query } = router.query
  const domain = (Array.isArray(query) ? query[0] : query)!

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1>Domain registration</h1>
        <div>{'Commit -> Wait a minute -> Register'}</div>
        <h2>{domain}</h2>
        <Step {...{ domain }} />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.domain) {
    return {
      redirect: {
        permanent: true,
        destination: '/'
      }
    }
  } else return { props: {} }
}

export default Register
