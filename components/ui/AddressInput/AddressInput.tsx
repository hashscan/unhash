import React, { useState } from 'react'
import { Input, InputProps } from '../Input/Input'
import { isValidAddress } from 'lib/utils'
import useEvent from 'react-use-event-hook'

const inputValueToAddress = (value: string) => {
  if (value === '') return undefined

  if (isValidAddress(value)) {
    return value
  }

  return null
}

export interface AddressInputProps extends InputProps {
  defaultValue?: string
  onAddressChange?: (address: string | undefined | null) => void // undefined - not set, null - invalid input
}

// Input with built-in address validation
// undefined - not set, null - invalid input
export const AddressInput = ({
  onAddressChange,
  onBlur,
  defaultValue,
  ...rest
}: AddressInputProps) => {
  const [value, setValue] = useState<string>(() => defaultValue ?? '')
  const [showError, setShowError] = useState<boolean>(false)

  // just to ensure that we don't do extra re-renders
  const onChangeStable = useEvent((value) => onAddressChange?.(value))

  return (
    <Input
      {...rest}
      error={showError ? 'Invalid address' : undefined}
      onBlur={(e) => {
        setShowError(inputValueToAddress(value) === null)
        onBlur?.(e)
      }}
      value={value ?? ''}
      onChange={(e) => {
        setShowError(false)
        setValue(e.target.value)
        onChangeStable(inputValueToAddress(e.target.value))
      }}
    />
  )
}
