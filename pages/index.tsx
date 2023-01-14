import React from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'
import { Nav } from 'components/Nav'

const ConnectWidget = dynamic(() => import('../components/ConnectWidget').then((m) => m.ConnectWidget), { ssr: false })

const Index = () => {
  return (
    <>
      <Nav />
    </>
  )
}

export default Index
