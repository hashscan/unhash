/* eslint-disable @next/next/no-img-element */
import { Domain } from 'lib/types'
import { openDialog } from 'lib/dialogs'
import { CameraReplace } from 'components/icons'

import styles from './Avatar.module.css'
import clsx from 'clsx'

import { useEnsAvatar } from 'lib/hooks/useEnsAvatar'
import { ComponentProps, useState } from 'react'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface AvatarProps extends ComponentProps<'div'> {
  domain: Domain
}

// Later avatar should be resolved on API side
export const Avatar = ({ domain, className }: AvatarProps) => {
  const [revalidating, setRevalidating] = useState(false)

  const {
    data: avatar,
    isLoading: isQueryLoading,
    isRefetching,
    isError,
    refetch
  } = useEnsAvatar(domain)

  const isLoading = isQueryLoading || revalidating || isRefetching
  const isUnset = !isLoading && (!avatar || isError)

  const changeAvatar = async () => {
    const success = await openDialog('setAvatar')
    if (!success) return

    setRevalidating(true)

    await delay(5000) // wait for the transaction to be mined
    await refetch()

    setRevalidating(false)
  }

  return (
    <div
      className={clsx(className, {
        [styles.avatar]: true,
        [styles.avatar_loading]: isLoading,
        [styles.avatar_unset]: isUnset
      })}
      onClick={changeAvatar}
    >
      <div className={styles.overlay}>
        <CameraReplace />
      </div>

      {!isLoading && avatar && (
        <img className={styles.avatarImg} src={avatar} alt={`ENS Avatar for ${domain}`} />
      )}
    </div>
  )
}
