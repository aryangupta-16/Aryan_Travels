'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, logout } from '../lib/api'

interface Journey {
  id: string
  name: string
  email: string
  contactNumber: string
  travelMode: 'flight' | 'train'
  source: string
  destination: string
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      const data = await getProfile()
      if (!data || data.error || data.message === 'Unauthorized') {
        logout()
        router.push('/login')
      } else {
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
        <div className="space-y-4 text-gray-700">
          <p><span className="font-semibold">Name:</span> {profile.name}</p>
          <p><span className="font-semibold">Email:</span> {profile.email}</p>
          <p><span className="font-semibold">Role:</span> {profile.role}</p>
          <p><span className="font-semibold">Joined:</span> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN') : ''}</p>
        </div>
        <button className="mt-8 btn-secondary" onClick={() => { logout(); router.push('/login'); }}>
          Logout
        </button>
      </div>
    </div>
  )
}
