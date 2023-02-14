import React, { useCallback, useEffect, useState } from 'react'
import { Input, InputProps } from '../Input/Input'
import { isValidAddress } from 'lib/utils'

export interface AddressInputProps extends InputProps {
  onAddressChange?: (address: string | null) => void // empty string - not set, null - invalid input
}

// TODO: support a way to trigger validation from parent
// TODO: support error message
// Input with built-in address validation
export const AddressInput = ({ onAddressChange, onChange, onBlur, ...rest }: AddressInputProps) => {
  const [address, setAddress] = useState<string | null>('') // empty string - not set, null - invalid input
  const [showError, setShowError] = useState<boolean>(false) // TODO: support validation error
  const onInputBlur = useCallback(() => setShowError(address === null), [address])

  const onInputChange = (value: string) => {
    setShowError(false)
    setAddress(value === '' || isValidAddress(value) ? value : null)
  }

  useEffect(() => {
    if (onAddressChange) onAddressChange(address)
  }, [onAddressChange, address])

  return (
    <Input
      error={showError ? 'Invalid address' : undefined}
      onBlur={(e) => {
        if (onBlur) onBlur(e)
        onInputBlur()
      }}
      onChange={(e) => {
        if (onChange) onChange(e)
        onInputChange(e.target.value)
      }}
      {...rest}
    />
  )
}
