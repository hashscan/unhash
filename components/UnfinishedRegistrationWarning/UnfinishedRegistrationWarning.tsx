import { Button } from 'components/ui/Button/Button'
import { Registration } from 'lib/types'

import styles from './UnfinishedRegistrationWarning.module.css'

type UnfinishedRegistrationWarningProps = {
  registration: Registration
  onCancel: () => void
  onContinue: () => void
}

export const UnfinishedRegistrationWarning = ({
  registration,
  onCancel,
  onContinue
}: UnfinishedRegistrationWarningProps) => {
  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.body}>
            <div className={styles.title}>Unfinished registration</div>
            <div className={styles.text}>
              You have not finished registering the <strong>{registration.names.join(', ')}</strong>{' '}
              {registration.names.length === 1 ? 'name' : 'names'}. Would you like to continue the
              registration process? If you skip this step, you might not be able to finalize it
              later on.
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              className={styles.cancelButton}
              onClick={onCancel}
              size={'regular'}
              variant={'ghost'}
            >
              Cancel Registration
            </Button>

            <Button size={'regular'} disabled={false} onClick={onContinue}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
