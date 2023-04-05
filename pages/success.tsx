import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { CheckoutProgress } from 'components/CheckoutProgress/CheckoutProgress'
import { CheckoutSuccessStep } from 'components/CheckoutSuccessStep/CheckoutSuccessStep'

import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { Domain } from 'lib/types'

import styles from './register.module.css'
import { notNull } from 'lib/utils'

interface SuccessProps {
  names: Domain[]
  registerTxHash: string
}

const Success: PageWithLayout<SuccessProps> = ({ names, registerTxHash }: SuccessProps) => {
  return (
    <>
      <Head>
        <title>{`${names.join(', ')} / ENS Domain Registration`}</title>
      </Head>

      <div className={styles.register}>
        <main className={styles.main}>
          <CheckoutProgress className={styles.progress} step={'success'} names={names} />

          <CheckoutSuccessStep names={names} registerTxHash={registerTxHash} />
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const names = Array.isArray(query.names) ? query.names : [query.names].filter(notNull)
  const registerTxHash = query.txHash

  if (!names.length || !registerTxHash) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: { names, registerTxHash }
  }
}

Success.layout = <ContainerLayout verticalPadding={false} />

export default Success
