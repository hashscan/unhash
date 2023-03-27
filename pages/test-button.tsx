import { Button } from 'components/ui/Button/Button'
import { TransactionButton } from 'components/CheckoutOrder/TransactionButton'
import { useReducer } from 'react'

export default function Test_Button() {
  const [status, update] = useReducer((status) => {
    switch (status) {
      case 'idle':
        return 'commit'
      case 'commit':
        return 'processing'
      case 'processing':
        return 'idle'
    }
  }, 'idle')

  return (
    <div style={{ display: 'flex', gap: 40 }}>
      <Button onClick={update}>toggle state</Button>
      <TransactionButton size="regular" status={status} onClick={update}>
        Save
      </TransactionButton>
      <TransactionButton size="medium" status={status} onClick={update}>
        Complete Registration →
      </TransactionButton>
      <TransactionButton size="cta" status={status} onClick={update}>
        Register molefrog.eth
      </TransactionButton>
    </div>
  )
}
