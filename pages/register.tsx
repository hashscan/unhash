import { Nav } from 'components/Nav'
import { useRouter } from 'next/router'
import React from 'react'
import styles from 'styles/register.module.css'

const Register = () => {
  const router = useRouter()
  const { domain } = router.query

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1>Register {domain}</h1>
      </main>
    </>
  )
}

export default Register
