/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react'
import styles from './ProfileCard.module.css'
import { Domain, Network, toChain } from 'lib/types'
import { Address, useEnsAvatar } from 'wagmi'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'
import { ProfileCardForm } from './ProfileCardForm'
import { openDialog } from 'lib/dialogs'

interface ProfileCardProps {
  network: Network
  address: Address
  domain: Domain
}

// Later avatar should be resolved on API side
const Avatar = ({ network, address }: { network: Network; address: Address }) => {
  // TODO: handle loading and empty state
  const { data: avatar } = useEnsAvatar({ chainId: toChain(network).id, address })

  return (
    <div className={styles.avatarWrapper} onClick={() => openDialog('setAvatar')}>
      {address && avatar && (
        <img className={styles.avatar} width={56} height={56} src={avatar} alt="" />
      )}
    </div>
  )
}

export const ProfileCard = ({ network, address, domain }: ProfileCardProps) => {
  const info = useDomainInfo(domain)
  const labels = useMemo(
    () => ({
      isOwner: info?.registrant?.toLowerCase() === address.toLowerCase(),
      isController: info?.controller?.toLowerCase() === address.toLowerCase()
    }),
    [address, info]
  )

  return (
    <div className={styles.card}>
      {info && labels && <></>}
      <div className={styles.info}>
        <Avatar network={network} address={address} />
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
