import React, { useState } from 'react'
import { Input, InputProps } from '../Input/Input'
import { isValidAddress } from 'lib/utils'
import useEvent from 'react-use-event-hook'

export interface AddressInputProps extends InputProps {
  defaultValue?: string
  onAddressChange?: (address: string | null) => void // empty string - not set, null - invalid input
}

// Input with built-in address validation
export const AddressInput = ({
  onAddressChange,
  onChange,
  onBlur,
  defaultValue,
  ...rest
}: AddressInputProps) => {
  const [address, setAddress] = useState<string | null>(() => defaultValue ?? '') // empty string - not set, null - invalid input
  const [showError, setShowError] = useState<boolean>(false)

  // just to ensure that we don't do extra re-renders
  const onChangeStable = useEvent((value) => onAddressChange?.(value))

  return (
    <Input
      error={showError ? 'Invalid address' : undefined}
      onBlur={(e) => {
        setShowError(address === null)
        onBlur?.(e)
      }}
      value={address ?? ''}
      onChange={(e) => {
        setShowError(false)
        const value = e.target.value
        const newAddress = value === '' || isValidAddress(value) ? value : null
        setAddress(newAddress)
        onChangeStable(newAddress)
        onChange?.(e)
      }}
      {...rest}
    />
  )
}
