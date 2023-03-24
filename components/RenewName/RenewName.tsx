import React, { ComponentProps, useMemo, useState } from 'react'
import styles from './RenewName.module.css'
import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { useNotifier } from 'lib/hooks/useNotifier'
import { RenewNameSuccess } from './RenewNameSuccess'
import { UserDomain } from 'lib/types'
import { formatExpiresOn } from 'lib/format'
import { RenewYearSelect } from './RenewYearSelect'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { useRenewName } from 'lib/hooks/useRenewName'

export interface RenewNameProps extends ComponentProps<'div'> {
  domain: UserDomain
  onClose?: () => void
  onSuccess?: () => void
}

export const RenewName = ({ domain, onClose, onSuccess, className, ...rest }: RenewNameProps) => {
  const notify = useNotifier()

  const [years, setYears] = useState(10)

  const newExpiration = useMemo(() => {
    console.log(`domain.expiresAt: ${domain.expiresAt!}`)
    console.log(`years: ${years}, ${years * YEAR_IN_SECONDS} seconds`)
    return domain.expiresAt! + years * YEAR_IN_SECONDS
  }, [domain.expiresAt, years])
  console.log(`newExpiration: ${newExpiration}`)

  // transaction to renew name
  const {
    write: sendTransaction,
    isLoading: isLoading,
    txHash,
    isSuccess
  } = useRenewName({
    domain: domain.name,
    duration: years * YEAR_IN_SECONDS,
    onError: (error) => notify(error.message, { status: 'error' }),
    onSuccess: () => onSuccess?.()
  })

  const renewName = () => {
    // TODO: show input error if address is not set
    // TODO: track analytics event
    sendTransaction?.()
  }

  return (
    <div {...rest} className={clsx(className, styles.modal)}>
      <div className={styles.body}>
        <div className={styles.title}>Renew name</div>
        <div className={styles.text}>
          The <b>{domain.name}</b> name expires on <b>{formatExpiresOn(domain.expiresAt!)}</b>.
          Expired domains are available for a public auction. Learn more.
        </div>

        <div className={styles.yearLabel}>Renew for</div>
        <RenewYearSelect
          className={styles.yearSelect}
          years={years}
          onYearChange={(years) => setYears(years)}
        />
        <div className={styles.hint}>
          {'New expiration date is '}
          <b>{formatExpiresOn(newExpiration)}</b>
        </div>
      </div>
      <div className={styles.footer}>
        <Button size={'regular'} variant={'ghost'} disabled={isLoading} onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          className={styles.buttonRenew}
          isLoading={isLoading}
          size={'regular'}
          onClick={renewName}
        >
          Renew&nbsp;&nbsp;→
        </Button>
      </div>
      {isSuccess && (
        <RenewNameSuccess
          className={styles.success}
          domain={domain.name}
          txHash={txHash ?? ''}
          onClose={() => onClose?.()}
        />
      )}
    </div>
  )
}
