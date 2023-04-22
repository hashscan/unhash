import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

import { RegistrationOrder } from 'lib/types'
import styles from './CheckoutCommitStep.module.css'
import { pluralize } from 'lib/pluralize'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'

import { EthereumIcon } from 'components/icons'

const YEAR_BUTTONS = [1, 2, 3, 4]

interface CheckoutCommitStepProps {
  order: RegistrationOrder
  updateOrder: Dispatch<SetStateAction<RegistrationOrder>>
}

export type CheckoutCommitHandle = {
  lock: () => void
  focus: () => void
}

type RegType = 'default' | 'forFriend'

export const CheckoutCommitStep = forwardRef<CheckoutCommitHandle, CheckoutCommitStepProps>(
  function CheckoutCommitStepWithRef({ order, updateOrder }, ref) {
    const [isLocked, lock] = useState(false)
    const [type, setType] = useState<RegType>('default')
    const addressInputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(
      ref,
      () => ({
        lock: () => lock(true),
        focus: () => addressInputRef.current?.focus()
      }),
      []
    )

    return (
      <div className={styles.container}>
        <div className={styles.formGroup}>
          <RadioGroup
            disabled={isLocked}
            value={type}
            onChange={(type: RegType) => {
              if (type === 'forFriend') {
                updateOrder((order) => ({ ...order, ownerAddress: null }))
              } else if (type === 'default') {
                updateOrder((order) => ({ ...order, ownerAddress: undefined }))
              }
              setType(type)
            }}
            className={styles.group}
          >
            <RadioGroup.Label className={styles.sr_only}>Type of registration</RadioGroup.Label>
            <RadioGroup.Option value={'default'}>
              {({ checked, disabled }) => (
                <div
                  className={clsx(styles.groupOption, {
                    [styles.groupOption_checked]: checked,
                    [styles.groupOption_disabled]: disabled
                  })}
                >
                  <div>Use by my wallet</div>
                </div>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value={'forFriend'} disabled={order.names.length > 1}>
              {({ checked, disabled }) => (
                <div
                  className={clsx(styles.groupOption, {
                    [styles.groupOption_checked]: checked,
                    [styles.groupOption_disabled]: disabled
                  })}
                >
                  <div>Simple register</div>

                  {checked && (
                    <AddressInput
                      ref={addressInputRef}
                      icon={<EthereumIcon />}
                      className={styles.ownerInput}
                      placeholder="0xd07d...54aB"
                      autoComplete="off"
                      disabled={isLocked}
                      defaultValue={order.ownerAddress ?? ''}
                      onAddressChange={(address) => {
                        updateOrder((order) => ({ ...order, ownerAddress: address }))
                      }}
                    />
                  )}
                </div>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.header}>Registration period</div>
          <div className={styles.subheader}>
            {"You'll"} get {order.names.length === 1 ? 'the name' : 'names'} for a selected period
            of time and can always renew it later. By choosing a longer period, you will save on
            renewal network fees.
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
)
