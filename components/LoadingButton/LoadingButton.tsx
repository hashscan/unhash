import React, { MouseEventHandler } from 'react'
import { Button } from 'components/ui/Button/Button'

type LoadingButtonProps = {
  text?: string
  isLoading?: boolean
  onClick?: MouseEventHandler
  className?: string | undefined
}

// Regular button with loader at the middle and disabled state while loading.
export const LoadingButton = ({ text, ...props }: LoadingButtonProps) => (
  <Button {...props}>{text}</Button>
)
