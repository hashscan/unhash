import { ComponentProps } from 'react'
import styles from './ProfileUser.module.css'
import { Domain } from 'lib/types'
import { Address } from 'wagmi'
import { Avatar } from '../ProfileCard/Avatar'
import clsx from 'clsx'
import { formatAddress } from 'lib/utils'

interface ProfileUserProps extends ComponentProps<'div'> {
  address: Address
  domain?: Domain
}

export const ProfileUser = ({ address, domain, className, ...rest }: ProfileUserProps) => {
  return (
    <>
      {!domain && (
        <>
          <div className={clsx(className, styles.addressLarge)}>
            {address ? formatAddress(address, 4) : null}
          </div>
        </>
      )}
      {domain && (
        <>
          <div className={clsx(className, styles.user)} {...rest}>
            <Avatar className={styles.avatar} domain={domain} />
            <div>
              <div className={styles.domain}>{domain}</div>
              <div className={styles.address}>{address ? formatAddress(address, 4) : null}</div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
