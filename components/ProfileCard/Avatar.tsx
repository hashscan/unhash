/* eslint-disable @next/next/no-img-element */
import { Network, toChain } from 'lib/types'
import { Address, useEnsAvatar } from 'wagmi'
import { openDialog } from 'lib/dialogs'
import { CameraReplace } from 'components/icons'

import styles from './Avatar.module.css'
import clsx from 'clsx'

// Later avatar should be resolved on API side
export const Avatar = ({ network, address }: { network: Network; address: Address }) => {
  const {
    data: avatar,
    isLoading,
    isError,
    refetch
  } = useEnsAvatar({ staleTime: 0, chainId: toChain(network).id, address })

  const isUnset = !isLoading && (!avatar || isError)

  const changeAvatar = async () => {
    try {
      await openDialog('setAvatar')
      refetch()
    } catch (e) {
      /* ignore */
    }
  }

  return (
    <div
      className={clsx({
        [styles.avatar]: true,
        [styles.avatar_loading]: isLoading,
        [styles.avatar_unset]: isUnset
      })}
      onClick={changeAvatar}
    >
      <div className={styles.overlay}>
        <CameraReplace />
      </div>

      {address && avatar && (
        <img className={styles.avatarImg} src={avatar} alt={`ENS Avatar for ${address}`} />
      )}
    </div>
  )
}
