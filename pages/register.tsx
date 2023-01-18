import { CommitmentForm } from 'components/CommitmentForm'
import { Nav } from 'components/Nav'
import { RegisterStep } from 'components/RegisterStep'
import { WaitMinute } from 'components/WaitMinute'
import { ethers } from 'ethers'
import { useENSInstance } from 'lib/hooks/useENSInstance'
import { useEthPrice } from 'lib/hooks/useEthPrice'
import { RegistrationStep } from 'lib/types'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import styles from 'styles/register.module.css'
import { useReadLocalStorage } from 'usehooks-ts'
import { useSigner, useProvider, useFeeData, useAccount } from 'wagmi'

const Step = ({ step, domain }: { step: RegistrationStep | null; domain: string }) => {
  const ens = useENSInstance()
  const { data: signer } = useSigner()
  const provider = useProvider<ethers.providers.JsonRpcProvider>()
  const { data: feeData } = useFeeData()
  const ethPrice = useEthPrice()
  const { address } = useAccount()

  switch (step) {
    case 'commit':
    default:
      return <CommitmentForm {...{ ens, signer, provider, feeData, ethPrice, domain }} accountAddress={address} />
    case 'wait':
      return <WaitMinute />
    case 'register':
      return <RegisterStep {...{ ens, ethPrice, feeData, provider, domain }} />
  }
}

const Register = () => {
  const router = useRouter()
  const { domain: query } = router.query
  const step = useReadLocalStorage<RegistrationStep>('step')
  const domain = (Array.isArray(query) ? query[0] : query)!

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1>Domain registration</h1>
        <p>{'Commit -> Wait a minute -> Register'}</p>
        <h2>{domain}</h2>
        <Step {...{ step, domain }} />
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
