import { isNameASCIIOnly, isValidName } from 'lib/utils'

export const WarningLabel = ({
  name,
  showNonAscii = true
}: {
  name: string
  showNonAscii: boolean
}) => {
  if (!isValidName(name)) {
    return <span title="Name is Malformed and contains invalid characters">&nbsp;⛔</span>
  }

  if (showNonAscii && !isNameASCIIOnly(name)) {
    return <span title="Name contains non-ASCII characters">&nbsp;⚠️</span>
  }

  return null
}
