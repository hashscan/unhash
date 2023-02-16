/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from 'react'
import styles from './ProfileCard.module.css'
import ui from 'styles/ui.module.css'
import clsx from 'clsx'
import { Domain, Fields, Network } from 'lib/types'
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

interface ProfileCardProps {
  network: Network
  address: Address
  domain: Domain
}

// TODO: display avatar from selected domain not current wallet
const Avatar = ({ address }: { address: Address }) => {
  const { data: avatar } = useEnsAvatar({ chainId: 1, address })

  return (
    <div className={styles.avatarWrapper}>
      {address && avatar && (
        <img className={styles.avatar} width={56} height={56} src={avatar} alt="" />
      )}
    </div>
  )
}

export const ProfileCard = ({ network, address, domain }: ProfileCardProps) => {
  // TODO: add other values
  // input values
  const [name, setName] = useState<string>('')

  // TODO: save and validate using React state
  const [fields, setFields] = useState<Fields>({})
  const { isLoading, write, error } = useSendSetFields({ domain, fields })
  // const onSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   if (e.currentTarget.reportValidity()) {
  //     const fd = new FormData(e.currentTarget)
  //     const f: Fields = {}

  //     for (const [k, v] of fd.entries()) {
  //       f[k] = v as string
  //     }

  //     setFields(f)

  //     if (typeof write !== 'undefined') write()
  //   }
  // }

  const onSave = (e: FormEvent<HTMLFormElement>) => {}

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <Avatar address={address} />
        <div>
          <div className={styles.profileDomain}>{domain}</div>
          <div className={styles.profileLabels}>
            <div className={styles.profileLabel}>Primary ENS</div>
            <div className={styles.profileLabel}>Owner</div>
            <div className={styles.profileLabel}>Controller</div>
          </div>
        </div>
      </div>

      <form className={styles.form} onSubmit={onSave}>
        <Input
          label="Name"
          placeholder="Mastodon"
          icon={<ProfileIcon />}
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Description"
          placeholder="Mastodon"
          icon={<DescriptionIcon />}
          autoComplete="off"
          // onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Website"
          placeholder="https://mastodon.social"
          icon={<GlobeIcon />}
          autoComplete="off"
          // onChange={(e) => setWebsite(e.target.value)}
        />
        <Input
          label="Twitter"
          placeholder="@mastodon"
          icon={<TwitterIcon />}
          autoComplete="off"
          // onChange={(e) => setTwitter(e.target.value)}
        />

        {/* Save button */}
        {error && <div className={ui.error}>{error.message}</div>}
        <button type="submit" disabled={isLoading} className={clsx(styles.saveButton, ui.button)}>
          {isLoading ? <ProgressBar color="white" /> : 'Save'}
        </button>
      </form>
    </div>
  )
}
