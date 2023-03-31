import { AnimatePresence } from 'framer-motion'
import { createNanoEvents } from 'nanoevents'
import { useEffect, useState } from 'react'

import { SetAvatarDialog } from 'components/SetAvatarDialog/SetAvatarDialog'
import { UnfinishedRegistrationDialog } from 'components/UnfinishedRegistration/UnfinishedRegistrationDialog'
import { SendName as SendNameDialog } from 'components/SendName/SendName'
import { RenewName as RenewNameDialog } from 'components/RenewName/RenewName'

/**
 * When adding new dialogs to the app, register their components here!
 */
const DialogComponents = {
  setAvatar: SetAvatarDialog,
  unfinishedRegistration: UnfinishedRegistrationDialog,
  sendName: SendNameDialog,
  renewName: RenewNameDialog
} as const

export type DialogName = keyof typeof DialogComponents
export type DialogParams = {
  [k in string]: any
} /* TODO: use generics to customize params for each dialog */

interface OpenDialogEventOptions {
  resolve: (value: unknown) => void
  reject: () => void
  params: DialogParams
}

interface Events {
  openDialog: (type: DialogName, options: OpenDialogEventOptions) => void
}

const mediator = createNanoEvents<Events>()

// imperative API for controlling dialogs
export const openDialog = (type: DialogName, params: DialogParams = {}) => {
  return new Promise((resolve, reject) => {
    mediator.emit('openDialog', type, { resolve, reject, params })
  })
}

// holds the  state of the currently open dialog and its params
interface CurrentDialog {
  type: DialogName
  options: OpenDialogEventOptions
}

export const Dialogs = () => {
  const [currentDialog, setCurrentDialog] = useState<CurrentDialog | null>(null)

  useEffect(() => {
    mediator.on('openDialog', (type, options) => setCurrentDialog({ type, options }))

    return () => {
      mediator.events = {}
    } // clear all subscribers
  }, [])

  return (
    <>
      {Object.entries(DialogComponents).map(([name, Dialog]) => {
        const open = currentDialog?.type === name

        return (
          <AnimatePresence key={name}>
            {open &&
              (() => {
                const closeDialog = (success: boolean = false) => {
                  if (success) currentDialog.options.resolve(success)
                  else currentDialog.options.reject()

                  setCurrentDialog(null)
                }

                return (
                  <Dialog
                    open={open}
                    params={currentDialog.options.params}
                    onClose={() => closeDialog(false)}
                    // imperative methods for closing the dialog
                    closeDialog={closeDialog}
                    closeDialogWithSuccess={() => closeDialog(true)}
                  />
                )
              })()}
          </AnimatePresence>
        )
      })}
    </>
  )
}
