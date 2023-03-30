import { SetAvatarDialog } from 'components/SetAvatarDialog/SetAvatarDialog'
import { createNanoEvents } from 'nanoevents'
import { useEffect, useState } from 'react'

/**
 * When adding new dialogs to the app, register their components here!
 */
const DialogComponents = {
  setAvatar: SetAvatarDialog,
  sendDomain: () => <>todo!</>
} as const

export type DialogName = keyof typeof DialogComponents

interface Events {
  openDialog: (type: DialogName) => void
  closeDialog: () => void
}

const mediator = createNanoEvents<Events>()

// imperative API for controlling dialogs
export const openDialog = (type: DialogName) => mediator.emit('openDialog', type)
export const closeDialog = () => mediator.emit('closeDialog')

export const Dialogs = () => {
  const [currentDialog, setCurrentDialog] = useState<DialogName | null>(null)

  useEffect(() => {
    mediator.on('openDialog', (type) => setCurrentDialog(type))
    mediator.on('closeDialog', () => setCurrentDialog(null))

    return () => {
      mediator.events = {}
    } // clear all subscribers
  }, [])

  return (
    <>
      {Object.entries(DialogComponents).map(([name, Dialog]) => (
        <Dialog key={name} open={currentDialog === name} onClose={() => setCurrentDialog(null)} />
      ))}
    </>
  )
}
