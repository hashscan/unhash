import clsx from 'clsx'
import { EthereumIcon } from 'components/icons'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'
import { Button } from 'components/ui/Button/Button'
import { useNotifier } from 'lib/hooks/useNotifier'
import { useSendSetAddr } from 'lib/hooks/useSendSetAddr'
import { Domain } from 'lib/types'
import { formatAddress } from 'lib/utils'
import React, { ComponentProps } from 'react'
import { useAccount } from 'wagmi'
import styles from './PrimaryDomainUnresolvedEth.module.css'

interface PrimaryDomainUnresolvedEthProps extends ComponentProps<'div'> {
  domain: Domain
  onResolved: (domain: Domain) => void
}

export const PrimaryDomainUnresolvedEth = ({
  domain,
  onResolved,
  className,
  ...rest
}: PrimaryDomainUnresolvedEthProps) => {
  const notify = useNotifier()
  const { address } = useAccount()

  // update records transaction
  const { sendSetAddr, isLoading: isUpdating } = useSendSetAddr({
    domain,
    address,
    onError: (error) => notify(error.message, { status: 'error' }),
    onSuccess: () => onResolved(domain)
  })
  const setEthRecord = () => {
    sendSetAddr?.()
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
            {domain} is pointing to another wallet. To use as a primary ENS, link it to your wallet
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