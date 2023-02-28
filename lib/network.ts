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

/**
 * @returns The name of the nerwork that this application supports
 */
export const currentNetwork = (): Network => {
  if (process.env.NEXT_PUBLIC_CHAIN) return process.env.NEXT_PUBLIC_CHAIN as Network

  const goerliSubdomain = /^goerli\./.test(String(process.env.NEXT_PUBLIC_VERCEL_URL))
  return goerliSubdomain ? 'goerli' : 'mainnet'
}
