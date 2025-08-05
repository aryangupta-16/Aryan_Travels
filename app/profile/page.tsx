'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, logout,getToken } from '../lib/api'
import axios from 'axios'

interface Journey {
  id: string
  name: string
  email: string
  contactNumber: string
  mode: 'flight' | 'train'
  source: string
  destination: string
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [error, setError] = useState('')

  const token = getToken()


  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      const data = await getProfile()
      if (!data || data.error || data.message === 'Unauthorized') {
        logout()
        router.push('/login')
      } else {

        const resp = await axios.get('http://localhost:8080/api/user/journeys', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setProfile(data)
        setJourneys(resp.data)
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

  const handleCancelJourney = async (journeyId: string) => {
    try {
      // Mock API call - replace with actual API endpoint
      const response = await axios.put(`http://localhost:8080/api/user/journeys/${journeyId}`, 
        {
          status: 'cancelled'
        }
        ,{headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }}
      )

      if (response.status === 200) {
        setJourneys(prev => 
          prev.map(journey => 
            journey.id === journeyId 
              ? { ...journey, status: 'cancelled' as const }
              : journey
          )
        )
      }
    } catch (error) {
      console.error('Failed to cancel journey:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  const JourneyCard = ({ journey, showCancelButton = false }: { journey: Journey, showCancelButton?: boolean }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {journey.source} → {journey.destination}
          </h3>
          <p className="text-sm text-gray-600">
            {journey?.mode?.charAt(0).toUpperCase() + journey?.mode?.slice(1)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(journey?.status)}`}>
          {journey?.status?.charAt(0).toUpperCase() + journey?.status?.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Contact:</span> {journey?.contactNumber}</p>
        <p><span className="font-medium">Booked on:</span> {formatDate(journey.createdAt)}</p>
      </div>
      
      {showCancelButton && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleCancelJourney(journey.id)}
            className="btn-secondary text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Cancel Journey
          </button>
        </div>
      )}
    </div>
  )

  const pendingJourneys = journeys.filter(j => j.status.toLowerCase() === 'pending')
  const completedJourneys = journeys.filter(j => j.status.toLowerCase() === 'completed')
  const cancelledJourneys = journeys.filter(j => j.status.toLowerCase() === 'cancelled')

  return (
    <>
    <div className="max-w-xl mt-12 mb-12">
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


<div className="max-w-6xl mx-auto">

<div className="space-y-8">
  {/* Pending Journeys */}
  <section>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
      Pending Journeys ({pendingJourneys.length})
    </h2>
    {pendingJourneys.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingJourneys.map(journey => (
          <JourneyCard key={journey.id} journey={journey} showCancelButton />
        ))}
      </div>
    ) : (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">No pending journeys</p>
      </div>
    )}
  </section>

  {/* Completed Journeys */}
  <section>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
      Completed Journeys ({completedJourneys.length})
    </h2>
    {completedJourneys.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedJourneys.map(journey => (
          <JourneyCard key={journey.id} journey={journey} />
        ))}
      </div>
    ) : (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">No completed journeys</p>
      </div>
    )}
  </section>

  {/* Cancelled Journeys */}
  <section>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
      Cancelled Journeys ({cancelledJourneys.length})
    </h2>
    {cancelledJourneys.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cancelledJourneys.map(journey => (
          <JourneyCard key={journey.id} journey={journey} />
        ))}
      </div>
    ) : (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">No cancelled journeys</p>
      </div>
    )}
  </section>
</div>
</div>
  </>
  )
}
