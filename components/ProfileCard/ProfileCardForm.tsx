/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import styles from './ProfileCardForm.module.css'
import { Domain, TextRecords } from 'lib/types'
import { Input } from 'components/ui/Input/Input'
import {
  Profile as ProfileIcon,
  Description as DescriptionIcon,
  Globe as GlobeIcon,
  Twitter as TwitterIcon
} from 'components/icons'

import { useSendUpdateRecords } from 'lib/hooks/useSendUpdateRecords'
import { DomainInfo } from 'lib/api'
import { useNotifier } from 'lib/hooks/useNotifier'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { trackGoal } from 'lib/analytics'

interface ProfileCardFormProps {
  domain: Domain
  info?: DomainInfo
}

// TODO: handle new inputs when update in saved
export const ProfileCardForm = ({ domain, info }: ProfileCardFormProps) => {
  const notify = useNotifier()

  // input values
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [twitter, setTwitter] = useState<string>('')

  // initialize from api
  const [initialized, setInitialized] = useState<boolean>(false) // fixes blinking on info set up
  useEffect(() => {
    if (!info) return

    setName(info.textRecords.name || '')
    setDescription(info.textRecords.description || '')
    setWebsite(info.textRecords.url || '')
    setTwitter(info.textRecords['com.twitter'] || '')

    setInitialized(true)
  }, [info])

  // save changes (can be optimized!)
  const changes: TextRecords = useMemo(() => {
    if (!info || !initialized) return {}

    const oldRecords = info.textRecords
    const records: TextRecords = {}

    if (name !== oldRecords.name) records.name = name
    if (description !== oldRecords.description) records.description = description
    if (website !== oldRecords.url) records.url = website
    if (twitter !== oldRecords['com.twitter']) records['com.twitter'] = twitter

    return records
  }, [initialized, info, name, description, website, twitter])

  // TODO: don't show user rejected error
  const onError = (error: Error) => notify(error.message, { status: 'error' })
  const onSuccess = () => notify('Your profile has been updated!', { status: 'info' })
  // update records transaction
  const { sendUpdate, status } = useSendUpdateRecords({
    domain,
    records: changes,
    onError,
    onSuccess
  })
  const save = () => {
    trackGoal('UpdateProfileClick')

    if (typeof sendUpdate === 'undefined') return
    sendUpdate()
  }

  const hasChanges = Object.keys(changes).length > 0
  const inputsDisabled = !initialized || status !== 'idle'

  return (
    <div className={styles.form}>
      <div className={styles.inputs}>
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
      </div>
      <div className={styles.footer}>
        <TransactionButton
          disabled={inputsDisabled || !hasChanges}
          status={status}
          size={'regular'}
          onClick={save}
        >
          Save
        </TransactionButton>
      </div>
    </div>
  )
}
