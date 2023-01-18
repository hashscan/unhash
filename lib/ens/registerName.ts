import { ENS } from '@ensdomains/ensjs'
import { BigNumber, ethers } from 'ethers'

export const registerName = async ({
  ens,
  domain,
  duration,
  signer,
  secret,
  owner,
  wrapperExpiry
}: {
  ens: ENS
  domain: string
  duration: number
  secret: string
  owner: string
  wrapperExpiry: BigNumber
  signer: ethers.providers.JsonRpcSigner
}) => {
  const controller = await ens.contracts!.getEthRegistrarController()!
  const [price] = await controller.rentPrice(domain, duration)

  const tx = await ens.registerName.populateTransaction(domain, {
    secret,
    owner,
    duration,
    value: price,
    addressOrIndex: owner,
    wrapperExpiry,
    signer
  })

  return tx
}
