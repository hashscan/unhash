import { YEAR_IN_SECONDS } from 'lib/constants'
import { RegistrationStep } from 'lib/types'
import { useLocalStorage } from 'usehooks-ts'

// TODO: describe return types
// TODO: replace return objects {} by arrays []?

export const useRegisterDuration = () => {
  const [duration, setDuration] = useLocalStorage<number>('duration', YEAR_IN_SECONDS)
  return { duration, setDuration }
}
export const useCommitSecret = (defaultValue = '') => {
  const [secret, setSecret] = useLocalStorage<string>('commit-secret', defaultValue)

  return { secret, setSecret }
}

export const useRegisterStep = () => {
  const [step, setStep] = useLocalStorage<RegistrationStep>('step', 'commit')

  return { step, setStep }
}
