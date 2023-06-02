/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import type { Domain } from 'lib/types'
import type { DomainInfo } from 'lib/api'
import { formatAddress, notNull } from 'lib/utils'
import { useEnsAvatar } from 'lib/hooks/useEnsAvatar'

import styles from './Profile.module.css'
import { WarningLabel } from 'components/WarningLabel/WarningLabel'
import { clsx } from 'clsx'
import { PropsWithChildren } from 'react'

interface DomainPageProps {
  domain: Domain
  info: DomainInfo
}

type AvatarProps = { domain: Domain }

const Avatar = ({ domain }: AvatarProps) => {
  const { data: avatar, isLoading } = useEnsAvatar(domain)

  return (
    <div
      className={clsx({
        [styles.avatarSlot]: true,
        [styles.avatar_loading]: isLoading
      })}
    >
      {!isLoading && avatar && (
        <img className={styles.avatarImg} src={avatar} alt={`ENS Avatar for ${domain}`} />
      )}
    </div>
  )
}

const Section = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (
    <div className={styles.section}>
      <div className={styles.section_title}>{title}</div>
      <div className={styles.section_content}>{children}</div>
    </div>
  )
}

const ProfileLink = ({
  link,
  label,
  info,
  isExternal
}: {
  link: string
  label: string
  info: string
  isExternal: boolean
}) => {
  const linkProps = isExternal
    ? {
        target: '_blank',
        rel: 'noreferrer'
      }
    : {}

  return (
    <Link className={styles.link} href={link} {...linkProps}>
      <span className={styles.link_label}>{label}</span>
      <span className={styles.link_info}>{info}</span>
      {isExternal && <span className={styles.external_link}>→</span>}
    </Link>
  )
}

export const Profile = ({ domain, info }: DomainPageProps) => {
  const name = info.textRecords.name ?? domain

  const links = Object.entries(info.textRecords)
    .map(([field, name]) => {
      if (field === 'url') {
        return [name.replace('https://', '').replace('http://', ''), name] as const
      }
      if (field === 'com.twitter' || field === 'com.github') {
        const site = field.split('.').reverse().join('.')
        return [name, `https://${site}/${name}`, site] as const
      }
      return null
    })
    .filter(notNull)

  return (
    <section className={styles.main}>
      <div className={styles.card}>
        <Avatar domain={domain} />

        <div className={styles.nameSlot}>
          <div className={styles.name}>
            {name} <WarningLabel name={domain} showNonAscii={true}></WarningLabel>
          </div>
          <div className={styles.address}>{formatAddress(info.addrRecords.ethereum ?? '', 4)}</div>
        </div>

        {!!info.textRecords.description && (
          <Section title={'Description'}>{info.textRecords.description}</Section>
        )}

        {!!links.length && (
          <Section title={'Links'}>
            {links.map(([type, link, site], index) => (
              <ProfileLink key={index} link={link} label={site ?? 'site'} info={type} isExternal />
            ))}
          </Section>
        )}

        <Section title={'Info'}>
          <ProfileLink
            link={`https://etherscan.io/address/${info.owner}`}
            label={'owner'}
            info={formatAddress(info.owner as Domain, 4)}
            isExternal
          />

          <ProfileLink
            link={`https://etherscan.io/address/${info.controller}`}
            label={'controller'}
            info={formatAddress(info.controller as Domain, 4)}
            isExternal
          />
        </Section>
      </div>
    </section>
  )
}
