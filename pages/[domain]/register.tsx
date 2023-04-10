import { GetServerSideProps } from 'next'
import api from 'lib/api'

// legacy page checkout ./pages/register
const Register = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as string

  const { isValid, isAvailable } = await api.checkDomain(domain)

  if (!isValid) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if (!isAvailable) {
    return {
      redirect: {
        destination: `/${domain}`,
        permanent: false
      }
    }
  }

  // redirect to the new register page
  return {
    redirect: {
      destination: `/register?names=${domain}`,
      permanent: false
    }
  }
}

export default Register
