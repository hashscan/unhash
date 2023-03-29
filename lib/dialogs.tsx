import { SetAvatarDialog } from 'components/SetAvatarDialog/SetAvatarDialog'
import { useState } from 'react'

export type DialogName = 'setAvatar' | 'sendDomain' | 'renewDomain'

export const Dialogs = () => {
  const [currentDialog, setCurrentDialog] = useState<DialogName | null>(null)

  return (
    <>
      <SetAvatarDialog
        open={currentDialog === 'setAvatar'}
        onClose={() => setCurrentDialog(null)}
      />
    </>
  )
}
