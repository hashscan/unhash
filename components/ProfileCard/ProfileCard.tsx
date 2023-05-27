/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react'
import styles from './ProfileCard.module.css'
import { Domain } from 'lib/types'
import { Address } from 'wagmi'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'
import { ProfileCardForm } from './ProfileCardForm'

import { Avatar } from './Avatar'

interface ProfileCardProps {
  address: Address
  domain: Domain
}

export const ProfileCard = ({ address, domain }: ProfileCardProps) => {
  const info = useDomainInfo(domain)
  const labels = useMemo(
    () => ({
      isOwner: info?.owner?.toLowerCase() === address.toLowerCase(),
      isController: info?.controller?.toLowerCase() === address.toLowerCase()
    }),
    [address, info]
  )

  return (
    <div className={styles.card}>
      {info && labels && <></>}
      <div className={styles.info}>
        <Avatar domain={domain} />
        <div>
          <div className={styles.domain}>{domain}</div>
          <div className={styles.labels}>
            <div className={styles.label}>Primary ENS</div>
            {labels.isOwner && <div className={styles.label}>Owner</div>}
            {labels.isController && <div className={styles.label}>Controller</div>}
          </div>
        </div>
      </div>

      <ProfileCardForm domain={domain} info={info} />
    </div>
  )
}
