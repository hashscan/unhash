import { AnimatePresence } from 'framer-motion'
import { createNanoEvents } from 'nanoevents'
import { useEffect, useState } from 'react'

import { SetAvatarDialog } from 'components/SetAvatarDialog/SetAvatarDialog'
import { UnfinishedRegistrationDialog } from 'components/UnfinishedRegistration/UnfinishedRegistrationDialog'

/**
 * When adding new dialogs to the app, register their components here!
 */
const DialogComponents = {
  setAvatar: SetAvatarDialog,
  unfinishedRegistration: UnfinishedRegistrationDialog
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
      {Object.entries(DialogComponents).map(([name, Dialog]) => {
        const open = currentDialog === name

        return (
          <AnimatePresence key={name}>
            {open && <Dialog open={open} onClose={() => setCurrentDialog(null)} />}
          </AnimatePresence>
        )
      })}
    </>
  )
}
