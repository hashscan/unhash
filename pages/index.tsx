import React from 'react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Nav } from 'components/Nav'
import { ProgressBar } from 'components/icons'
import styles from 'styles/Index.module.css'
import ui from 'styles/ui.module.css'
import api from 'lib/api'
import { useChainId } from 'wagmi'
import { validateDomain } from 'lib/utils'


const Index = () => {
  const router = useRouter()

  const [domainInput, setDomainInput] = useState<string>('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const [isAvailable, setAvailable] = useState<boolean | null>(null)
  const [isLoading, setLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)

  const onDomainInputChanged = (input: string) => {
    setDomainInput(input.trim())
    if (validationError) setValidationError(null)
    setAvailable(null)
  }

  const chainId = useChainId()

  // fetch domain availability on input change
  // todo: add network
  // todo: fix race condition
  // todo: add debounce
  useEffect(() => {
    if (validateDomain(domainInput)) return

    const checkAvailability = async () => {
      try {
        setLoading(true)
        const available = await api.checkDomain(domainInput, chainId === 1 ? 'mainnet' : 'goerli')
        setAvailable(available)
        setLoading(false)
      } catch (e) {
        // todo: handle request and api errors
        console.log(`Error checking domain ${domainInput}: ${e}`)
        setAvailable(null)
        setLoading(false)
      }
    }

    checkAvailability()
  }, [domainInput])

  const onRegisterClick = async () => {
    if (domainInput.length === 0) return
    // show validation error on click
    const e = validateDomain(domainInput)
    if (e) {
      setValidationError(e)
      return
    }

    // ignore on loading
    if (isLoading) return

    // route if available
    if (isAvailable) {
      router.push(`/register?domain=${domainInput}`)
      return
    }
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.search}>
          <input
            style={{ width: 340 }}
            className={ui.input}
            type="text"
            autoComplete="off"
            defaultValue={''}
            placeholder="v1rtl.eth"
            onChange={(e) => onDomainInputChanged(e.currentTarget.value)}
          />
          <button style={{ width: 120 }} disabled={isLoading} className={ui.button} onClick={() => onRegisterClick()}>
            {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Register'}
          </button>
        </div>
        {validationError && <div className={styles.info}>{validationError}</div>}
        {isAvailable !== null && (
          <div className={styles.info} style={{ color: isAvailable ? 'var(--green)' : 'var(--error)' }}>
            {isAvailable === true ? 'Domain is available!' : 'This domain is taken.'}
          </div>
        )}
        {/* TODO: add request error */}
      </div>
    </>
  )
}

export default Index
