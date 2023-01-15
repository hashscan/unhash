import { ENS } from '@ensdomains/ensjs'
import { ProgressBar } from 'components/icons'
import { Nav } from 'components/Nav'
import { BigNumber, ethers, PopulatedTransaction } from 'ethers'
import { useENSInstance } from 'hooks/useENSInstance'
import { useSendCommit } from 'hooks/useSendCommit'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from 'styles/register.module.css'
import { useAccount, useProvider, useSigner } from 'wagmi'

const Register = () => {
  const router = useRouter()
  const { domain: query } = router.query
  const { address: accountAddress } = useAccount()
  const ens = useENSInstance()
  const domain = (Array.isArray(query) ? query[0] : query)!
  const [duration, setDuration] = useState(1)
  const [address, setAddress] = useState<string>(accountAddress as string)
  const [commitTx, setCommitTx] = useState<PopulatedTransaction>()
  const { data: signer } = useSigner()
  const { config, sendTransaction, error, isLoading } = useSendCommit(commitTx)
  const provider = useProvider()

  useEffect(() => {
    const fn = async () => {
      const { customData, ...commitPopTx } = await ens
        .withProvider(provider as ethers.providers.JsonRpcProvider)
        .commitName.populateTransaction(domain, {
          duration: duration * 31536000,
          owner: address,
          addressOrIndex: address,
          signer: signer as ethers.providers.JsonRpcSigner
        })

      setCommitTx(commitPopTx)
    }
    if (address && duration && signer) fn()
  }, [address, duration, signer])

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1>Domain registration</h1>
        <h2>{domain}</h2>
        <label htmlFor="address">Owner: </label>
        <input
          name="owner"
          value={address}
          pattern="^0x[a-fA-F0-9]{40}$"
          onChange={(v) => setAddress(v.currentTarget.value as `0x${string}`)}
          defaultValue={accountAddress}
        />
        <label htmlFor="duration">Duration (years): </label>
        <input
          name="duration (years)"
          placeholder="1"
          type="number"
          min={1}
          defaultValue={1}
          onChange={(v) => {
            const n = v.currentTarget.valueAsNumber
            if (!isNaN(n)) setDuration(n)
          }}
        />
        <button
          onClick={async () => {
            sendTransaction?.()
          }}
        >
          {isLoading ? <ProgressBar /> : 'Commit'}
        </button>
        gas limit: {config.request && BigNumber.from(config.request.gasLimit).toNumber()}
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
