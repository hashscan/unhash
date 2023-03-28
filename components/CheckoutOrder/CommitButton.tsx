import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import useChange from '@react-hook/change'

import { RegistrationOrder } from 'lib/types'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import { Button } from 'components/ui/Button/Button'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'

import styles from './CommitButton.module.css'
import { useNotifier } from 'lib/hooks/useNotifier'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { trackGoal } from 'lib/analytics'

interface CommitButtonProps {
  order: RegistrationOrder
}

export const CommitButton = ({ order }: CommitButtonProps) => {
  const { domain } = order
  const { address } = useAccount()

  const { sendCommit, status, error } = useSendCommit({
    domain: order.domain,
    duration: order.durationInYears * YEAR_IN_SECONDS,
    owner: order.ownerAddress ?? address,
    setDefaultResolver: true,
    addr: order.ownerAddress ?? address // can be set a different address or no address
  })

  const notify = useNotifier()

  useChange(error?.message, (current) => {
    if (current) {
      notify(current, { status: 'error', title: 'Error sending transaction' })
    }
  })

  const onStartClick = useCallback(() => {
    trackGoal('CommitClick', { props: { domain } })

    // can't send transaction for any reason (e.g. wallet not connected, alchemy down, etc.)`
    try {
      sendCommit?.()
    } catch (error) {
      const msg = error instanceof Error ? error.toString() : 'Commit error'
      notify(msg, { status: 'error' })
    }
  }, [sendCommit, notify, domain])

  return (
    <div>
      <ConnectButton.Custom>
        {({ account, chain, mounted, openConnectModal }) => {
          const walletConnected = account && chain && mounted

          if (!walletConnected) {
            return (
              <Button size="cta" className={styles.commitButton} onClick={openConnectModal}>
                Connect Wallet
              </Button>
            )
          }

          return (
            <TransactionButton
              size="cta"
              status={status}
              className={styles.commitButton}
              onClick={() => onStartClick()}
            >
              Register {domain}
            </TransactionButton>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}
