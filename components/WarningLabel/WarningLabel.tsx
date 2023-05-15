import { isNameASCIIOnly, isValidName } from 'lib/utils'
import { Label } from 'components/ui/Label/Label'
import { ComponentProps } from 'react'

export const WarningLabel = ({
  name,
  size = 'sm'
}: {
  name: string
  size?: ComponentProps<typeof Label>['size']
}) => {
  if (!isValidName(name)) {
    return (
      <Label
        size={size}
        type={'error'}
        title="Name contains invalid character(s) and is Malformed"
      ></Label>
    )
  }

  if (!isNameASCIIOnly(name)) {
    return (
      <Label size={size} type={'warning'} title="This name contains non-ASCII characters"></Label>
    )
  }

  return null
}
