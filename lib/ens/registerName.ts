import { ENS } from '@ensdomains/ensjs'
import { ethers } from 'ethers'

export const registerName = async ({
  ens,
  domain,
  duration,
  provider,
  secret,
  owner
}: {
  ens: ENS
  domain: string
  duration: number
  provider: ethers.providers.JsonRpcProvider
  secret: string
  owner: string
}) => {
  const controller = await ens.contracts!.getEthRegistrarController()!
  const [price] = await controller.rentPrice(domain, duration)

  const tx = await ens.withProvider(provider).registerName.populateTransaction(domain, {
    secret,
    owner,
    duration,
    value: price
  })

  return tx
}
