import { useCallback } from 'react'
import { useAccount, useChainId } from 'wagmi'

import { RegistrationOrder, toNetwork } from 'lib/types'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import { Button } from 'components/ui/Button/Button'

import styles from './CommitButton.module.css'

interface CommitButtonProps {
  order: RegistrationOrder
}

export const CommitButton = ({ order }: CommitButtonProps) => {
  const { domain } = order

  const chainId = useChainId()
  const { address } = useAccount()

  const { sendCommit, isLoading, error } = useSendCommit({
    domain: order.domain,
    network: toNetwork(chainId),
    duration: order.durationInYears * YEAR_IN_SECONDS,
    owner: order.ownerAddress || address
  })

  const onStartClick = useCallback(() => {
    // can't send transaction for any reason (e.g. wallet not connected, alchemy down, etc.)`
    sendCommit?.()
  }, [sendCommit])

  return (
    <div>
      <Button
        size="cta"
        className={styles.commitButton}
        onClick={() => onStartClick()}
        isLoading={isLoading}
      >
        Register {domain}
      </Button>

      {/* TODO: remove temp error solution */}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  )
}
