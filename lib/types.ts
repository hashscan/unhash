import { mainnet, goerli, Chain } from 'wagmi/chains'
import { MIN_COMMIT_TIME_S } from './constants'


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

// TODO: compute dynamically in Step component from Registration
export type RegistrationStep = 'commit' | 'wait' | 'register' | 'success'


export type Registration = {
  domain: string
  name: string
  owner: string
  duration: number // seconds
  secret: string
  status: RegistrationStatus
  commitTxHash?: string
  commitTimestamp?: number
  registerTxHash?: string
}

export enum RegistrationStatus {
  CommitSent = 'commit_sent',
  Commited = 'commited',
  RegisterSent = 'register_sent',
  Registered = 'registered',
}

export function isWaiting(reg: Registration): boolean {
  return reg.status === RegistrationStatus.Commited
    && !!reg.commitTimestamp
    && new Date().getTime() - reg.commitTimestamp < MIN_COMMIT_TIME_S
}