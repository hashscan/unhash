/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import styles from './ProfileCard.module.css'
import ui from 'styles/ui.module.css'
import clsx from 'clsx'
import { Domain, DomainRecords, Network, toChain } from 'lib/types'
import { Address, useEnsAvatar } from 'wagmi'
import { Input } from 'components/ui/Input/Input'
import {
  Profile as ProfileIcon,
  Description as DescriptionIcon,
  Globe as GlobeIcon,
  Twitter as TwitterIcon,
  ProgressBar
} from 'components/icons'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'

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

  // TODO: create ProfileCardForm component
  // input values
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [twitter, setTwitter] = useState<string>('')
  // initialize from api
  useEffect(() => {
    if (!info) return

    setName(info.records.name || '')
    setDescription(info.records.description || '')
    setWebsite(info.records.url || '')
    setTwitter(info.records['com.twitter'] || '')
  }, [info])

  // save changes (can be optimized!)
  const changedRecords: DomainRecords = useMemo(() => {
    if (!info) return {}

    const oldRecords = info.records
    const changes: DomainRecords = {}

    if (name !== oldRecords.name) changes.name = name
    if (description !== oldRecords.description) changes.description = description
    if (website !== oldRecords.url) changes.url = website
    if (twitter !== oldRecords['com.twitter']) changes['com.twitter'] = twitter

    return changes
  }, [info, name, description, website, twitter])

  const hasChanges = Object.keys(changedRecords).length > 0

  // const { isLoading, error } = useSendSetFields({ domain, fields })
  const isLoading = false
  const save = () => {
    console.log('hey')
  }

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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Description"
          placeholder="Mastodon"
          icon={<DescriptionIcon />}
          autoComplete="off"
          disabled={!info}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Website"
          placeholder="https://mastodon.social"
          icon={<GlobeIcon />}
          autoComplete="off"
          disabled={!info}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <Input
          label="Twitter"
          placeholder="@mastodon"
          icon={<TwitterIcon />}
          autoComplete="off"
          disabled={!info}
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
        />

        {/* Save button */}
        <button
          disabled={!hasChanges}
          className={clsx(styles.saveButton, ui.button)}
          onClick={save}
        >
          {isLoading ? <ProgressBar color="white" /> : 'Save'}
        </button>
      </form>
    </div>
  )
}
