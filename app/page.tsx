'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getToken } from './lib/api'
import { jwtDecode } from 'jwt-decode'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    let decodedToken: any = {}
    if (token) {
      decodedToken = jwtDecode(token)
    }
    console.log(decodedToken)

    if (token) {
      router.push('/home')
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}
