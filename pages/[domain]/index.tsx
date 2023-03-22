/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useReducer, useState, type Dispatch } from 'react'

import { Button } from 'components/ui/Button/Button'
import { FullWidthLayout, PageWithLayout } from 'components/layouts'

import { Domain, currentNetwork } from 'lib/types'
import api, { DomainInfo } from 'lib/api'
import { validateDomain } from 'lib/utils'
import { formatAddress, notNull } from 'lib/utils'

import styles from './domain.module.css'
import socialStyles from './SocialProfile.module.css'

interface DomainPageProps {
  domain: Domain
  info: DomainInfo
}

const BackgroundSVG = ({ color = '#EEE', bgColor = '#FAFAFA', size = 20, dotSize = 1 } = {}) =>
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="${bgColor}" d="M0 0h${size}v${size}H0z"/>
  <circle cx="${size / 4}" r="${dotSize}" fill="${color}"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${dotSize}" fill="${color}"/>
  <circle cx="${size}" cy="${size / 2}" r="${dotSize}" fill="${color}"/>
  <circle cy="${size / 2}" r="${dotSize}" fill="${color}"/>
  <circle cx="${size / 4}" cy="${size}" r="${dotSize}" fill="${color}"/>
  <circle cx="${(3 * size) / 4}" cy="${size}" r="${dotSize}" fill="${color}"/>
  <circle cx="${(3 * size) / 4}" r="${dotSize}" fill="${color}"/>
</svg>`)

type Settings = {
  color: string
  bgColor: string
  size: number
  dotSize: number
}

function Debug({ settings, update }: { settings: Settings; update: Dispatch<Partial<Settings>> }) {
  return (
    <div className={socialStyles.bgDebug}>
      <label>
        color:{' '}
        <input
          type="color"
          value={settings.color}
          onChange={(e) => update({ color: e.target.value })}
          style={{ appearance: 'auto' }}
        />
      </label>
      <label>
        bgColor:{' '}
        <input
          type="color"
          value={settings.bgColor}
          onChange={(e) => update({ bgColor: e.target.value })}
          style={{ appearance: 'auto' }}
        />
      </label>
      <label>
        size:{' '}
        <input
          type="range"
          min={1}
          max={500}
          value={settings.size}
          onChange={(e) => update({ size: Number.parseInt(e.target.value) })}
          style={{ appearance: 'auto' }}
        />
      </label>
      <label>
        dotSize:{' '}
        <input
          type="range"
          min={1}
          max={100}
          value={settings.dotSize}
          onChange={(e) => update({ dotSize: Number.parseInt(e.target.value) })}
          style={{ appearance: 'auto' }}
        />
      </label>
    </div>
  )
}

const SocialProfile = ({ domain, info }: DomainPageProps) => {
  const [debug, setDebug] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setDebug(params.has('debug'))
  }, [])

  const [settings, update] = useReducer(
    (v: Settings, a: Partial<Settings>): Settings => ({ ...v, ...a }),
    {
      color: '#EEE',
      bgColor: '#FAFAFA',
      size: 100,
      dotSize: 5
    }
  )

  const name = info.textRecords.name ?? domain

  const links = Object.entries(info.textRecords)
    .map(([field, name]) => {
      if (field === 'url') {
        return [name.replace('https://', '').replace('http://', ''), name] as const
      }
      if (field.includes('.')) {
        const link = `https://${field.split('.').reverse().join('.')}`
        return [name, `${link}/${name}`, `${link}/favicon.ico`] as const
      }
      return null
    })
    .filter(notNull)

  return (
    <section
      className={socialStyles.main}
      style={{ backgroundImage: `url("${BackgroundSVG(settings)}")` }}
    >
      {/* nav */}

      <div className={socialStyles.card}>
        <div className={socialStyles.avatarSlot}>
          {/* <img src={} alt={`${name}'s avatar`} /> */}
        </div>

        <div className={socialStyles.nameSlot}>
          <div className={socialStyles.name}>{name}</div>
          <div className={socialStyles.address}>{formatAddress(info.addrRecords.ethereum!, 4)}</div>
        </div>

        {info.textRecords.description && (
          <div className={socialStyles.description}>{info.textRecords.description}</div>
        )}

        <div className={socialStyles.links}>
          {links.map(([type, link, ico], index) => (
            <Button as="a" size="regular" className={socialStyles.link} key={index} href={link}>
              {ico && <img width={10} src={ico} alt={`icon for ${link}`} />}

              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* nfts */}

      {debug && <Debug settings={settings} update={update} />}
    </section>
  )
}

const TechInfo = ({ domain, info }: DomainPageProps) => (
  <div className={styles.main}>
    <div className={styles.title}>{domain}</div>
    <div className={styles.address}>{formatAddress(info.registrant as Domain, 4)}</div>
    <div className={styles.info}>
      This domain is owned by{' '}
      <Link
        className={styles.link}
        href={`https://etherscan.io/address/${info.registrant}`}
        target="_blank"
      >
        {formatAddress(info.registrant as Domain, 4)}
      </Link>
      {info.addrRecords.ethereum ? (
        <>
          {' '}
          and points to{' '}
          <Link
            className={styles.link}
            href={`https://etherscan.io/address/${info.addrRecords.ethereum}`}
            target="_blank"
          >
            {formatAddress(info.addrRecords.ethereum, 4)}
          </Link>{' '}
          address.
        </>
      ) : (
        '.'
      )}
    </div>

    <code>
      <pre style={{ fontFamily: 'var(--font-mono)' }}>{JSON.stringify(info, null, 2)}</pre>
    </code>
  </div>
)

const Domain: PageWithLayout<DomainPageProps> = (props: DomainPageProps) => {
  const { domain, info } = props

  return (
    <>
      <Head>
        <title>{domain}</title>
      </Head>

      {Object.keys(info.textRecords).length && <SocialProfile {...props} />}

      <TechInfo {...props} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as Domain
  const network = currentNetwork()

  if (validateDomain(domain)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  let domainInfo: DomainInfo
  try {
    domainInfo = await api.domainInfo(domain, network)
  } catch (e) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      domain,
      info: domainInfo
    }
  }
}

Domain.layout = FullWidthLayout

export default Domain
