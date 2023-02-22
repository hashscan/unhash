import React, { useEffect, useState } from 'react'
import { Input, InputProps } from '../Input/Input'
import { isValidAddress } from 'lib/utils'
import useEvent from 'react-use-event-hook'

export interface AddressInputProps extends InputProps {
  onAddressChange?: (address: string | null) => void // empty string - not set, null - invalid input
}

// TODO: support a way to trigger validation from parent
// TODO: support error message
// Input with built-in address validation
export const AddressInput = ({ onAddressChange, onChange, onBlur, ...rest }: AddressInputProps) => {
  const [address, setAddress] = useState<string>('')
  const [showError, setShowError] = useState<boolean>(false)

  // just to ensure that we don't do extra re-renders
  const onChangeStable = useEvent((value) => onAddressChange?.(value))
  const isValid = isValidAddress(address)

  useEffect(() => {
    if (isValid) {
      onChangeStable(address)
    } else {
      onChangeStable(null)
    }
  }, [isValid, address, onChangeStable])

  return (
    <Input
      error={showError && !isValid ? 'Invalid address' : undefined}
      onBlur={(e) => {
        setShowError(true)
        onBlur?.(e)
      }}
      value={address}
      onChange={(e) => {
        setAddress(e.target.value)
        setShowError(false)
        onChange?.(e)
      }}
      {...rest}
    />
  )
}
