import { useState, useEffect } from 'react'
import { Button } from 'components/ui/Button/Button'
import { useRouterNavigate } from 'lib/hooks/useRouterNavigate'
import { useRegistration } from 'lib/hooks/useRegistration'

import styles from './UnfinishedRegistration.module.css'

type UnfinishedRegistrationProps = {}

export const UnfinishedRegistration = ({}: UnfinishedRegistrationProps) => {
  const { registration, clearRegistration } = useRegistration()
  const [isModalOpen, show] = useState(false)
  const navigate = useRouterNavigate()

  useEffect(() => {
    if (registration && registration.status !== 'registered') {
      show(true)
    }
  }, [clearRegistration, registration])

  return isModalOpen && registration ? (
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
              onClick={() => {
                clearRegistration()
                show(false)
              }}
              size={'regular'}
              variant={'ghost'}
            >
              Cancel Registration
            </Button>

            <Button
              size={'regular'}
              disabled={false}
              onClick={() => {
                navigate(`/${registration.names[0]}/register`)
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  ) : null
}
