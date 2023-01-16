import { CommitmentForm } from 'components/CommitmentForm'
import { Nav } from 'components/Nav'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import styles from 'styles/register.module.css'

const Register = () => {
  const router = useRouter()
  const { domain: query } = router.query

  const domain = (Array.isArray(query) ? query[0] : query)!

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1>Domain registration</h1>
        <p>{'Commit -> Wait a minute -> Register'}</p>
        <h2>{domain}</h2>
        <CommitmentForm {...{ domain }} />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.domain) {
    return { notFound: true }
  } else return { props: {} }
}

export default Register
