import clsx from 'clsx'
import { EthereumIcon } from 'components/icons'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'
import { Button } from 'components/ui/Button/Button'
import { Domain } from 'lib/types'
import { formatAddress } from 'lib/utils'
import React, { ComponentProps } from 'react'
import { useAccount } from 'wagmi'
import styles from './PrimaryDomainUnresolvedEth.module.css'

interface PrimaryDomainUnresolvedEthProps extends ComponentProps<'div'> {
  domain: Domain
}

export const PrimaryDomainUnresolvedEth = ({
  domain,
  className,
  ...rest
}: PrimaryDomainUnresolvedEthProps) => {
  const { address } = useAccount()


  const isUpdating = false
  const setEthRecord = () => {

  }

  return (
    <div {...rest} className={clsx(className)}>
      <div className={styles.linkRow}>
        <div>
          <AddressInput
            className={styles.input}
            icon={<EthereumIcon />}
            placeholder={formatAddress(address!, 4)}
            autoComplete="off"
            disabled={true}
          />
          <div className={styles.hint}>
            {domain} is pointing to another wallet. To set as a primary ENS, link it to your wallet
            first.
          </div>
        </div>
        <Button
          className={styles.linkButton}
          isLoading={isUpdating}
          size={'regular'}
          onClick={setEthRecord}
        >
          Link
        </Button>
      </div>
    </div>
  )
}
