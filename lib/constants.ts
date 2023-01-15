import { ethers } from 'ethers'

export const publicProvider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth', 1)
