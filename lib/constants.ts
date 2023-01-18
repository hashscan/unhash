import { ethers } from 'ethers'

export const API_URL = 'https://xens-api.vercel.app'

export const publicProvider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth', 1)

export const YEAR_IN_SECONDS = 31536000
