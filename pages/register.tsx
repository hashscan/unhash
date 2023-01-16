import { CommitmentForm } from 'components/CommitmentForm'
import { Nav } from 'components/Nav'
import { WaitMinute } from 'components/WaitMinute'
import { PopulatedTransaction } from 'ethers'
import { useSendCommit } from 'hooks/useSendCommit'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from 'styles/register.module.css'

const Register = () => {
  const router = useRouter()
  const { domain: query, step } = router.query

  const domain = (Array.isArray(query) ? query[0] : query)!

  const [commitTx, setCommitTx] = useState<PopulatedTransaction>()

  const {
    config: commitConfig,
    sendTransaction: commit,
    error: commitError,
    isLoading: isCommitLoading,
    isSuccess: isCommitSuccess
  } = useSendCommit(commitTx)

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1>Domain registration</h1>
        <p>{'Commit -> Wait a minute -> Register'}</p>
        <h2>{domain}</h2>
        {step === 'registration' ? (
          <p>registration step</p>
        ) : !isCommitSuccess ? (
          <WaitMinute />
        ) : (
          <CommitmentForm
            {...{ domain, commitTx, setCommitTx }}
            error={commitError}
            isLoading={isCommitLoading}
            isSuccess={isCommitSuccess}
            sendTransaction={commit}
            config={commitConfig}
          />
        )}
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
