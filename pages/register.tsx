import { ENS } from '@ensdomains/ensjs'
import { Nav } from 'components/Nav'
import { ethers, PopulatedTransaction } from 'ethers'
import { useENSInstance } from 'hooks/useENSInstance'
import { useSendCommit } from 'hooks/useSendCommit'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from 'styles/register.module.css'
import { useAccount, useSigner } from 'wagmi'

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
  const { sendTransaction, isLoading, data, error } = useSendCommit(commitTx)

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
            const { customData, ...commitPopTx } = await ens.commitName.populateTransaction(domain, {
              duration,
              owner: address,
              addressOrIndex: address,
              signer: signer as ethers.providers.JsonRpcSigner
            })
            setCommitTx(commitPopTx)

            // const { secret, wrapperExpiry } = customData!

            // const controller = await ens.contracts!.getEthRegistrarController()!
            // const [price] = await controller.rentPrice(domain, duration)

            // const tx = await ens.registerName(domain, {
            //   owner: address,
            //   duration: duration * 31536000,
            //   secret,
            //   value: price
            // })

            // await tx.wait()
          }}
        >
          Register
        </button>
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
