import { ENS } from '@ensdomains/ensjs'
import { ethers } from 'ethers'

export const commitName = async ({
  provider,
  duration,
  address,
  domain,
  ens,
  signer
}: {
  domain: string
  duration: number
  address: string
  provider: ethers.providers.JsonRpcProvider
  ens: ENS
  signer: ethers.providers.JsonRpcSigner
}) => {
  const { customData, ...commitPopTx } = await ens.withProvider(provider).commitName.populateTransaction(domain, {
    duration: duration * 31536000,
    owner: address,
    addressOrIndex: address,
    signer
  })

  const { secret, wrapperExpiry } = customData!

  return { commitPopTx, secret, wrapperExpiry }
}
