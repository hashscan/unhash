import { ENS_GOERLI } from 'lib/constants'
import ENSRegistarController from 'abis/ENSRegistarController.json'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

export const useRegisterENS = ({ name, owner, duration }: { name: string; owner: string; duration: number }) => {
  const { config } = usePrepareContractWrite({
    address: ENS_GOERLI,
    abi: ENSRegistarController,
    functionName: 'register',
    args: [name, owner, duration]
  })
}
