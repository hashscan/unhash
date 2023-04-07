import { AnimatePresence } from 'framer-motion'
import { createNanoEvents } from 'nanoevents'
import { useEffect, useState, ComponentProps } from 'react'

import { SetAvatarDialog } from 'components/SetAvatarDialog/SetAvatarDialog'
import { UnfinishedRegistrationDialog } from 'components/UnfinishedRegistration/UnfinishedRegistrationDialog'
import { SendName as SendNameDialog } from 'components/SendName/SendName'
import { RenewName as RenewNameDialog } from 'components/RenewName/RenewName'

/**
 * When adding new dialogs to the app, register their components here!
 */
const DialogComponents = {
  setAvatar: SetAvatarDialog,
  sendName: SendNameDialog,
  renewName: RenewNameDialog,
  unfinishedRegistration: UnfinishedRegistrationDialog
} as const

export type DialogName = keyof typeof DialogComponents

type ParamsForDialog = {
  [k in DialogName]: ComponentProps<typeof DialogComponents[k]>['params']
}

interface OpenDialogEventOptions {
  resolve: (value: boolean) => void
  reject: () => void
  params: ParamsForDialog[keyof ParamsForDialog]
}

interface Events {
  openDialog: (type: DialogName, options: OpenDialogEventOptions) => void
}

const mediator = createNanoEvents<Events>()

// imperative API for controlling dialogs
export const openDialog = <T extends DialogName>(
  type: T,
  params?: ParamsForDialog[T]
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    mediator.emit('openDialog', type, { resolve, reject, params: params || {} })
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
                  currentDialog.options.resolve(success)
                  setCurrentDialog(null)
                }

                // cast to a component that accepts any props so that we don't have
                // to worry about the type of `params`
                const DialogCast = Dialog as React.ComponentType<{ [k in string]: any }>

                return (
                  <DialogCast
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
