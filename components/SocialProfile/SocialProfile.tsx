/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useEffect, useReducer, useState, type Dispatch } from 'react'

import { Button } from 'components/ui/Button/Button'

import { Globe, Twitter, Github } from 'components/icons'

import type { Domain } from 'lib/types'
import type { DomainInfo } from 'lib/api'
import { formatAddress, notNull } from 'lib/utils'
import { useCopy } from 'lib/hooks/useCopy'

import styles from './SocialProfile.module.css'

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

function Icon({ site }: { site?: string }) {
  switch (site) {
    case 'github.com':
      return <Github />
    case 'twitter.com':
      return <Twitter />
    default:
      return <Globe />
  }
}

function Debug({ settings, update }: { settings: Settings; update: Dispatch<Partial<Settings>> }) {
  return (
    <div className={styles.bgDebug}>
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

export const SocialProfile = ({ domain, info }: DomainPageProps) => {
  const [state, copy] = useCopy()

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
        const site = field.split('.').reverse().join('.')
        return [name, `https://${site}/${name}`, site] as const
      }
      return null
    })
    .filter(notNull)

  return (
    <section
      className={styles.main}
      style={{ backgroundImage: `url("${BackgroundSVG(settings)}")` }}
    >
      <div className={styles.spNavigation}>
        <Button
          variant="ghost"
          onClick={() => {
            copy(location.toString())
          }}
        >
          {state === 'errored' && 'Error'}
          {state === 'copied' && 'Copied'}
          {state === 'idle' && 'Copy'}
        </Button>

        {/* @ts-ignore */}
        <Button as={Link} href="/">
          Get your .eth name&nbsp;&nbsp;→
        </Button>
      </div>

      <div className={styles.card}>
        <div className={styles.avatarSlot}>
          {info.textRecords.avatar && info.textRecords.avatar.startsWith('http') && (
            <img src={info.textRecords.avatar} alt="" />
          )}
        </div>

        <div className={styles.nameSlot}>
          <div className={styles.name}>{name}</div>
          <div className={styles.address}>{formatAddress(info.addrRecords.ethereum!, 4)}</div>
        </div>

        {info.textRecords.description && (
          <div className={styles.description}>{info.textRecords.description}</div>
        )}

        <div className={styles.links}>
          {links.map(([type, link, site], index) => (
            <a className={styles.link} key={index} href={link} target="_blank" rel="noreferrer">
              <Icon site={site} />
              {type}
              <span>→</span>
            </a>
          ))}
        </div>
      </div>

      {/* nfts */}

      {debug && <Debug settings={settings} update={update} />}
    </section>
  )
}
