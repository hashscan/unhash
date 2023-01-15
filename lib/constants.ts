import { ethers } from 'ethers'

export const ENS_GOERLI = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const

export const publicProvider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth', 1)
