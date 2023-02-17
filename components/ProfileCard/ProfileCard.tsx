/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useMemo, useState } from 'react'
import styles from './ProfileCard.module.css'
import ui from 'styles/ui.module.css'
import clsx from 'clsx'
import { Domain, Fields, Network, toChain } from 'lib/types'
import { Address, useEnsAvatar } from 'wagmi'
import { Input } from 'components/ui/Input/Input'
import {
  Profile as ProfileIcon,
  Description as DescriptionIcon,
  Globe as GlobeIcon,
  Twitter as TwitterIcon,
  ProgressBar
} from 'components/icons'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'

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
    <div className={styles.avatarWrapper}>
      {address && avatar && (
        <img className={styles.avatar} width={56} height={56} src={avatar} alt="" />
      )}
    </div>
  )
}

export const ProfileCard = ({ network, address, domain }: ProfileCardProps) => {
  const info = useDomainInfo(network, domain)

  const labels = useMemo(
    () => ({
      isOwner: info?.registrant?.toLowerCase() === address.toLowerCase(),
      isController: info?.controller?.toLowerCase() === address.toLowerCase()
    }),
    [address, info]
  )
  useEffect(() => {}, [info])

  // // TODO: add other values
  // // input values
  // const [name, setName] = useState<string>('')
  // // TODO: save and validate using React state
  const [fields] = useState<Fields>({})
  const { isLoading, error } = useSendSetFields({ domain, fields })
  const save = () => {}

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

      <form className={styles.form}>
        <Input
          label="Name"
          placeholder="Mastodon"
          icon={<ProfileIcon />}
          autoComplete="off"
          disabled={!info}
          value={info?.records?.name}
          // onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Description"
          placeholder="Mastodon"
          icon={<DescriptionIcon />}
          autoComplete="off"
          disabled={!info}
          value={info?.records?.description}
          // onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Website"
          placeholder="https://mastodon.social"
          icon={<GlobeIcon />}
          autoComplete="off"
          disabled={!info}
          value={info?.records?.url}
          // onChange={(e) => setWebsite(e.target.value)}
        />
        <Input
          label="Twitter"
          placeholder="@mastodon"
          icon={<TwitterIcon />}
          autoComplete="off"
          disabled={!info}
          value={info?.records?.['com.twitter']}
          // onChange={(e) => setTwitter(e.target.value)}
        />

        {/* Save button */}
        {error && <div className={ui.error}>{error.message}</div>}
        <button
          disabled={true}
          className={clsx(styles.saveButton, ui.button)}
          onClick={() => save()}
        >
          {isLoading ? <ProgressBar color="white" /> : 'Save'}
        </button>
      </form>
    </div>
  )
}
