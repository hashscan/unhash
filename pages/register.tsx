import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { parseDomainName, validateDomain } from 'lib/utils'
import styles from 'styles/register.module.css'
import type { Domain } from 'lib/types'
import api, { DomainInfo } from 'lib/api'
import { goerli, useChainId } from 'wagmi'
import { useRegisterStatus } from 'lib/hooks/storage'

const Step = dynamic(() => import('components/Step').then((m) => m.Step), {
  ssr: false,
  loading: () => <div>loading...</div>
})

interface RegisterProps {
  domain: Domain
  name: string
}

const Register: NextPage<RegisterProps> = (props) => {
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const chainId = useChainId()
  const { status } = useRegisterStatus()

  useEffect(() => {
    if (status === 'registerPending' || status === 'commitPending')
      api
        .domainInfo(props.domain)
        .then((res) => setDomainInfo(res))
        .catch(() => console.log(`Not found`))
  }, [props.domain, status])

  return (
    <>
      <main className={styles.main}>
        {domainInfo ? (
          <>
            <h1 style={{ marginTop: '40px' }}>{props.domain}</h1>
            <h2>Records</h2>
            {Object.entries(domainInfo.records).map(([k, v]) => {
              return v ? (
                <div key={`${k}-${v}`}>
                  <span>{k}</span> - <span>{v}</span>
                </div>
              ) : null
            })}
            <h2>Misc</h2>
            {chainId !== goerli.id ? (
              <>
                <div>Controller: {domainInfo.controller}</div>
                <div>Registrant: {domainInfo.registrant}</div>
                <div>Resolver: {domainInfo.resolver}</div>
              </>
            ) : (
              <div>no info</div>
            )}
          </>
        ) : (
          <>
            <h1 style={{ marginTop: '40px' }}>
              Register <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{props.domain}</span>
            </h1>
            <div
              style={{ height: '1px', background: 'var(--border-2)', marginTop: '20px', marginBottom: '40px' }}
            ></div>
            <Step {...props} />
          </>
        )}
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
