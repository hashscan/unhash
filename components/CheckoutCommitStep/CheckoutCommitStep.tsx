import React, { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'

import { RegistrationOrder } from 'lib/types'
import styles from './CheckoutCommitStep.module.css'
import { pluralize } from 'lib/pluralize'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'

import { Tool as ToolIcon, EthereumIcon } from 'components/icons'
import { AdditionalInfo } from 'components/AdditionalInfo/AdditionalInfo'

const YEAR_BUTTONS = [1, 2, 3, 4]

interface CheckoutCommitStepProps {
  order: RegistrationOrder
  updateOrder: Dispatch<SetStateAction<RegistrationOrder>>
}

export const CheckoutCommitStep = ({ order, updateOrder }: CheckoutCommitStepProps) => {
  // TODO: show connect wallet button if not connected
  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <div className={styles.header}>Registration period</div>
        <div className={styles.subheader}>
          By choosing a longer period, you can save on transaction fees later on.
        </div>
        <div className={styles.years}>
          {YEAR_BUTTONS.map((year) => (
            <div
              key={year}
              className={clsx(styles.yearButton, {
                [styles.yearButtonSelected]: year === order.durationInYears
              })}
              onClick={() => {
                updateOrder((order) => ({ ...order, durationInYears: year }))
              }}
            >
              {pluralize('year', year)}
            </div>
          ))}
        </div>
      </div>

      <AdditionalInfo header="Advanced Settings" icon={<ToolIcon />}>
        <div className={styles.subheader}>
          You can specify a wallet address of the <b>domain owner</b>. For example, if you are
          buying this domain for another person.
        </div>

        <AddressInput
          icon={<EthereumIcon />}
          className={styles.ownerInput}
          placeholder="0xd07d...54aB"
          autoComplete="off"
          onAddressChange={(address) => {
            const newOwner = address === null ? undefined : address // todo: make it less ugly
            updateOrder((order) => ({ ...order, ownerAddress: newOwner }))
          }}
        />
      </AdditionalInfo>

      {/* TODO: Profile */}
      {/* <div>
      <div className={styles.header}>ENS Profile</div>
      <div className={styles.subheader}>
        Configure public ENS profile for this domain if you are setting it for your wallet. You can
        skip it or complete after registration
      </div>
      <input
        name="name"
        placeholder="Add a display name"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="description"
        placeholder="Add a bio to your profile"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="url"
        placeholder="Add your website"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="email"
        placeholder="Personal email"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="twitter"
        placeholder="@username"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input, styles.profileInputLast)}
      />
      </div> */}
    </div>
  )
}
