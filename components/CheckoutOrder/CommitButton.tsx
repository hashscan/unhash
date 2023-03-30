import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import useChange from '@react-hook/change'

import { RegistrationOrder } from 'lib/types'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { useSendCommits } from 'lib/hooks/useSendCommits'
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
  const { names } = order
  const { address: sender } = useAccount()

  // leaving this here to use in the future for 1 name registration with params
  // const { sendCommit, status, error } = useSendCommit({
  //   domain: names[0],
  //   duration: order.durationInYears * YEAR_IN_SECONDS,
  //   owner: order.ownerAddress ?? sender,
  //   setDefaultResolver: true,
  //   addr: order.ownerAddress ?? sender // can be set a different address or no address
  // })

  // later should only be used for multiple names
  const { sendCommit, status, error } = useSendCommits({
    names: names,
    duration: order.durationInYears * YEAR_IN_SECONDS,
    owner: order.ownerAddress ?? sender
  })

  const notify = useNotifier()

  useChange(error?.message, (current) => {
    if (current) {
      notify(current, { status: 'error', title: 'Error sending transaction' })
    }
  })

  const onStartClick = useCallback(() => {
    trackGoal('CommitClick', { props: { names: names.join(',') } })

    // can't send transaction for any reason (e.g. wallet not connected, alchemy down, etc.)`
    try {
      sendCommit?.()
    } catch (error) {
      const msg = error instanceof Error ? error.toString() : 'Commit error'
      notify(msg, { status: 'error' })
    }
  }, [sendCommit, notify, names])

  return (
    <div>
      <ConnectButton.Custom>
        {({ account, chain, mounted, openConnectModal }) => {
          const walletConnected = account && chain && mounted
          const buttonLabel =
            names.length === 1 ? `Register ${names[0]}` : `Register ${names.length} names`

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
              {buttonLabel}
            </TransactionButton>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}
