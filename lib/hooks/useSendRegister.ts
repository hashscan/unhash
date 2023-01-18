import { BigNumber, ethers, PopulatedTransaction } from 'ethers'
import { ETH_REGISTRAR_ADDRESS, ETH_REGISTRAR_ABI, YEAR_IN_SECONDS } from 'lib/constants'
import { RegistrationStep } from 'lib/types'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { usePrepareContractWrite, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

export const useSendRegister = ({ name, owner }: { name: string; owner: string }) => {
  const duration = useReadLocalStorage<number>('duration')
  const secret = useReadLocalStorage<string>('commit-secret')

  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS,
    abi: ETH_REGISTRAR_ABI,
    functionName: 'register',
    args: [name, owner, duration || YEAR_IN_SECONDS, secret],
    overrides: { value: ethers.utils.parseEther('0.1') }
  })
  const [_, setRegTx] = useLocalStorage('reg-tx', '')
  const [__, setStep] = useLocalStorage<RegistrationStep>('step', 'register')
  const { sendTransaction, data, error: sendError, isError: isSendError } = useSendTransaction(config)

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setRegTx(data.transactionHash)
      setStep('success')
    }
  })

  return { data, isLoading, sendTransaction, config, isSuccess, sendError, remoteError, isSendError, isRemoteError }
}
