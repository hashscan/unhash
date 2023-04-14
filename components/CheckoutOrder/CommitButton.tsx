import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import useChange from '@react-hook/change'

import { RegistrationOrder } from 'lib/types'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { Button } from 'components/ui/Button/Button'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'

import styles from './CommitButton.module.css'
import { useNotifier } from 'lib/hooks/useNotifier'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { trackGoal } from 'lib/analytics'
import { useSendCommits } from 'lib/hooks/useSendCommits'
import { useSendCommit } from 'lib/hooks/useSendCommit'

interface CommitButtonProps {
  order: RegistrationOrder
}

export const CommitButton = ({ order }: CommitButtonProps) => {
  const { names } = order
  const { address: sender } = useAccount()
  const nullableSender = sender ? sender : null

  const useCommitHook = names.length === 1 ? useSendCommit : useSendCommits
  const { sendCommit, status, error } = useCommitHook({
    names,
    duration: order.durationInYears * YEAR_IN_SECONDS,
    owner: order.ownerAddress !== undefined ? order.ownerAddress : nullableSender,
    // two arguments only used by a single name hook (TODO: fix that)
    setDefaultResolver: true,
    addr: order.ownerAddress === undefined ? sender : order.ownerAddress // can be set a different address or no address
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
