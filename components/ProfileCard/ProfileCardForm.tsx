/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import styles from './ProfileCardForm.module.css'
import ui from 'styles/ui.module.css'
import clsx from 'clsx'
import { Domain, DomainRecords } from 'lib/types'
import { Input } from 'components/ui/Input/Input'
import {
  Profile as ProfileIcon,
  Description as DescriptionIcon,
  Globe as GlobeIcon,
  Twitter as TwitterIcon,
  ProgressBar
} from 'components/icons'

import { useSendUpdateRecords } from 'lib/hooks/useSendUpdateRecords'
import { DomainInfo } from 'lib/api'

interface ProfileCardFormProps {
  domain: Domain
  info?: DomainInfo
}

// TODO: handle new inputs when update in saved
export const ProfileCardForm = ({ domain, info }: ProfileCardFormProps) => {
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

  // TODO: fix blink on info load with "" record changes
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

  // update records transaction
  const {
    sendUpdate,
    isLoading: isUpdating,
    error: updateError
  } = useSendUpdateRecords({ domain, records: changedRecords })
  const save = () => {
    if (typeof sendUpdate === 'undefined') return
    sendUpdate()
  }
  // TODO: show error

  const hasChanges = Object.keys(changedRecords).length > 0
  const inputsDisabled = !info || isUpdating

  return (
    <div className={styles.form}>
      <Input
        label="Name"
        placeholder="Mastodon"
        icon={<ProfileIcon />}
        autoComplete="off"
        disabled={inputsDisabled}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Description"
        placeholder="Mastodon"
        icon={<DescriptionIcon />}
        autoComplete="off"
        disabled={inputsDisabled}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        label="Website"
        placeholder="https://mastodon.social"
        icon={<GlobeIcon />}
        autoComplete="off"
        disabled={inputsDisabled}
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <Input
        label="Twitter"
        placeholder="@mastodon"
        icon={<TwitterIcon />}
        autoComplete="off"
        disabled={inputsDisabled}
        value={twitter}
        onChange={(e) => setTwitter(e.target.value)}
      />

      <button
        disabled={inputsDisabled || !hasChanges}
        className={clsx(styles.saveButton, ui.button)}
        onClick={save}
      >
        {isUpdating ? <ProgressBar color="white" /> : 'Save'}
      </button>
    </div>
  )
}
