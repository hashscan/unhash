import clsx from 'clsx'
import { Domain } from 'lib/types'
import React, { ComponentProps } from 'react'
import styles from './PrimaryDomainUnresolvedEth.module.css'

interface PrimaryDomainUnresolvedEthProps extends ComponentProps<'div'> {
  domain: Domain
}

export const PrimaryDomainUnresolvedEth = ({
  domain,
  className,
  ...rest
}: PrimaryDomainUnresolvedEthProps) => {
  return (
    <div {...rest} className={clsx(className, styles.card)}>
      Warning: This domain is pointing to another wallet. Please set ETH record to your wallet first.
    </div>
  )
}
