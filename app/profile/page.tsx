'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }

    // Mock data - replace with actual API call
    const mockJourneys: Journey[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        contactNumber: '9876543210',
        travelMode: 'flight',
        source: 'Mumbai',
        destination: 'Delhi',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'John Doe',
        email: 'user@example.com',
        contactNumber: '9876543210',
        travelMode: 'train',
        source: 'Delhi',
        destination: 'Bangalore',
        status: 'completed',
        createdAt: '2024-01-10T14:20:00Z'
      },
      {
        id: '3',
        name: 'John Doe',
        email: 'user@example.com',
        contactNumber: '9876543210',
        travelMode: 'flight',
        source: 'Chennai',
        destination: 'Kolkata',
        status: 'cancelled',
        createdAt: '2024-01-05T09:15:00Z'
      }
    ]

    setJourneys(mockJourneys)
    setLoading(false)
  }, [session, status, router])

  const handleCancelJourney = async (journeyId: string) => {
    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`/api/journeys/${journeyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      })

      if (response.ok) {
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
            {journey.travelMode.charAt(0).toUpperCase() + journey.travelMode.slice(1)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(journey.status)}`}>
          {journey.status.charAt(0).toUpperCase() + journey.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Contact:</span> {journey.contactNumber}</p>
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

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) return null

  const pendingJourneys = journeys.filter(j => j.status === 'pending')
  const completedJourneys = journeys.filter(j => j.status === 'completed')
  const cancelledJourneys = journeys.filter(j => j.status === 'cancelled')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your travel bookings and view journey history</p>
      </div>

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
  )
}
