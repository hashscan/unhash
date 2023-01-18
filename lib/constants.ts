import { ethers } from 'ethers'

export const API_URL = 'https://xens-api.vercel.app'

export const publicProvider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth', 1)

export const YEAR_IN_SECONDS = 31536000

export const ETH_REGISTRAR_ADDRESS = '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5' // goerli
export const ETH_REGISTRAR_ABI = [
  'function available(string) view returns (bool)',
  'function makeCommitment(string,address,bytes32) pure returns (bytes32)',
  'function commit(bytes32)',
  'function register(string,address,uint256,bytes32) payable'
]
