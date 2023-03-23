import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import Link from 'next/link'
import { ComponentProps } from 'react'
import styles from './SendNameSuccess.module.css'
import { useEtherscanURL } from 'lib/hooks/useEtherscanURL'
import { CheckFilled } from 'components/icons'

interface SendNameSuccessProps extends ComponentProps<'div'> {
  domain: string
  txHash: string
  onClose?: () => void
}

export const SendNameSuccess = ({
  domain,
  txHash,
  onClose,
  className,
  ...rest
}: SendNameSuccessProps) => {
  const txLink = useEtherscanURL('tx', txHash)

  return (
    <div className={clsx(className, styles.container)} {...rest}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <CheckFilled className={styles.icon} fillColor={'var(--color-success)'} />
        </div>
        <div className={styles.header}>Success!</div>
        <div className={styles.subheader}>
          The <span className={styles.name}>{domain}</span> name has been sent.
          <br />
          <Link className={styles.link} href={txLink} target="_blank">
            View transaction
          </Link>{' '}
          on Etherscan.
        </div>
      </div>

      <Button
        className={styles.close}
        disabled={false}
        isLoading={false}
        size={'regular'}
        onClick={() => onClose?.()}
      >
        OK
      </Button>
    </div>
  )
}
