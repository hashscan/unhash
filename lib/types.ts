import { mainnet, goerli, Chain } from 'wagmi/chains'


export type Network = 'mainnet' | 'goerli'

export function toChain(network: Network): Chain {
  switch (network) {
    case 'mainnet':
      return mainnet
    case 'goerli':
      return goerli
  }
}

export type RegistrationStep = 'commit' | 'wait' | 'register' | 'success'
