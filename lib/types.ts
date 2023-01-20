/* eslint-disable no-unused-vars */
import { mainnet, goerli, Chain } from 'wagmi/chains'

export type Network = 'mainnet' | 'goerli'

// Maps Network to wagmi.Chain
export function toChain(network: Network): Chain {
  switch (network) {
    case 'mainnet':
      return mainnet
    case 'goerli':
      return goerli
  }
}

// Maps wagmi.Chain.id to Network
export function toNetwork(chainId: number): Network {
  switch (chainId) {
    case mainnet.id:
      return 'mainnet'
    case goerli.id:
      return 'goerli'
    default:
      throw new Error('Unsupported chain')
  }
}

export type Registration = {
  name: string
  owner: string
  duration: number // seconds
  secret: string
  status: RegistrationStatus
  commitTxHash?: string
  commitBlock?: number
  registerTxHash?: string
}

export type RegistrationStatus = 'start' | 'commitPending' | 'committed' | 'registerPending' | 'registered'
