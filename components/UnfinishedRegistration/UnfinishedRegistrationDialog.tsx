import { Button } from 'components/ui/Button/Button'
import { useRouterNavigate } from 'lib/hooks/useRouterNavigate'
import { useRegistration } from 'lib/hooks/useRegistration'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

import styles from './UnfinishedRegistrationDialog.module.css'

type UnfinishedRegistrationDialogProps = DialogExternalProps & {}

export const UnfinishedRegistrationDialog = ({
  closeDialog,
  closeDialogWithSuccess,
  ...rest
}: UnfinishedRegistrationDialogProps) => {
  const { registration, clearRegistration } = useRegistration()
  const navigate = useRouterNavigate()

  if (!registration) return null

  return (
    <Dialog
      {...rest}
      size="md"
      canCloseDialog={false}
      footer={
        <div className={styles.footer}>
          <Button
            className={styles.cancelButton}
            onClick={() => {
              if (confirm('Are you sure you want to cancel the registration process?')) {
                clearRegistration()
                closeDialog()
              }
            }}
            size={'regular'}
            variant={'ghost'}
          >
            Cancel Registration
          </Button>

          <Button
            className={styles.continueButton}
            size={'regular'}
            disabled={false}
            onClick={() => {
              navigate(`/${registration.names[0]}/register`)
              closeDialogWithSuccess()
            }}
          >
            Continue
          </Button>
        </div>
      }
    >
      <div className={styles.body}>
        <div className={styles.title}>Unfinished Registration!</div>
        <div className={styles.text}>
          <p>
            You have not finished registering the <strong>{registration.names.join(', ')}</strong>{' '}
            {registration.names.length === 1 ? 'name' : 'names'}. Would you like to continue the
            registration process?
          </p>

          <p>If you skip this step, you might not be able to finalize it later on.</p>
        </div>
      </div>
    </Dialog>
  )
}
