import React, { useMemo, useState } from 'react'
import styles from './RenewName.module.css'
import { Button } from 'components/ui/Button/Button'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { useNotifier } from 'lib/hooks/useNotifier'
import { RenewNameSuccess } from './RenewNameSuccess'
import { UserDomain } from 'lib/types'
import { formatExpiresOn } from 'lib/format'
import { RenewYearSelect } from './RenewYearSelect'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { useRenewName } from 'lib/hooks/useRenewName'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

export interface RenewNameProps extends DialogExternalProps {}

export const RenewName = ({
  params,
  closeDialog,
  closeDialogWithSuccess,
  ...rest
}: RenewNameProps) => {
  const domain = params?.domain as UserDomain
  const notify = useNotifier()

  const [years, setYears] = useState(1)

  const newExpiration = useMemo(() => {
    return domain.expiresAt! + years * YEAR_IN_SECONDS
  }, [domain.expiresAt, years])

  // transaction to renew name
  const {
    write: sendTransaction,
    status,
    txHash,
    isSuccess
  } = useRenewName({
    domain: domain.name,
    duration: years * YEAR_IN_SECONDS,
    onError: (error) => notify(error.message, { status: 'error' })
  })

  const renewName = () => {
    // TODO: track analytics event
    sendTransaction?.()
  }

  return (
    <Dialog
      {...rest}
      size={'md'}
      footer={
        !isSuccess && (
          <div className={styles.footer}>
            <Button
              size="regular"
              variant="ghost"
              disabled={status !== 'idle'}
              onClick={() => closeDialog()}
            >
              Cancel
            </Button>
            <TransactionButton status={status} size={'regular'} onClick={renewName}>
              Renew&nbsp;&nbsp;→
            </TransactionButton>
          </div>
        )
      }
    >
      <div className={styles.body}>
        <div className={styles.title}>Renew name</div>
        <div className={styles.text}>
          The <b>{domain.name}</b> name expires on <b>{formatExpiresOn(domain.expiresAt!)}</b>.
          Expired domains are available for a public auction. Learn more.
        </div>

        <div className={styles.yearLabel}>Renew for</div>
        <RenewYearSelect
          className={styles.yearSelect}
          name={domain.name}
          years={years}
          onYearChange={(years) => setYears(years)}
        />
        <div className={styles.hint}>
          {'New expiration date will be '}
          <b>{formatExpiresOn(newExpiration)}</b>
        </div>

        {isSuccess && (
          <RenewNameSuccess
            className={styles.success}
            domain={domain.name}
            txHash={txHash ?? ''}
            onClose={() => closeDialogWithSuccess()}
          />
        )}
      </div>
    </Dialog>
  )
}
