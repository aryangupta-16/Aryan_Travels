'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

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

const ITEMS_PER_PAGE = 10

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }

    // Check if user is admin
    if (session.user?.email !== 'admin@aryantravels.com') {
      router.push('/home')
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
        name: 'Jane Smith',
        email: 'jane@example.com',
        contactNumber: '9876543211',
        travelMode: 'train',
        source: 'Delhi',
        destination: 'Bangalore',
        status: 'pending',
        createdAt: '2024-01-14T14:20:00Z'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        contactNumber: '9876543212',
        travelMode: 'flight',
        source: 'Chennai',
        destination: 'Kolkata',
        status: 'pending',
        createdAt: '2024-01-13T09:15:00Z'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        contactNumber: '9876543213',
        travelMode: 'train',
        source: 'Bangalore',
        destination: 'Mumbai',
        status: 'pending',
        createdAt: '2024-01-12T16:45:00Z'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david@example.com',
        contactNumber: '9876543214',
        travelMode: 'flight',
        source: 'Hyderabad',
        destination: 'Pune',
        status: 'pending',
        createdAt: '2024-01-11T11:30:00Z'
      },
      // Add more mock data to test pagination
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 6}`,
        name: `User ${i + 6}`,
        email: `user${i + 6}@example.com`,
        contactNumber: `987654321${i}`,
        travelMode: i % 2 === 0 ? 'flight' as const : 'train' as const,
        source: 'Mumbai',
        destination: 'Delhi',
        status: 'pending' as const,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }))
    ]

    setJourneys(mockJourneys)
    setLoading(false)
  }, [session, status, router])

  const handleStatusUpdate = async (journeyId: string, newStatus: 'completed' | 'pending') => {
    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`/api/admin/journeys/${journeyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setJourneys(prev => 
          prev.map(journey => 
            journey.id === journeyId 
              ? { ...journey, status: newStatus }
              : journey
          )
        )
      }
    } catch (error) {
      console.error('Failed to update journey status:', error)
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

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || session.user?.email !== 'admin@aryantravels.com') {
    return null
  }

  const pendingJourneys = journeys.filter(j => j.status === 'pending')
  const totalPages = Math.ceil(pendingJourneys.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentJourneys = pendingJourneys.slice(startIndex, endIndex)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage pending journey bookings</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Journeys ({pendingJourneys.length})
          </h2>
        </div>

        {currentJourneys.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Journey Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booked On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentJourneys.map((journey) => (
                    <tr key={journey.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{journey.name}</div>
                          <div className="text-sm text-gray-500">{journey.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {journey.source} → {journey.destination}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {journey.travelMode}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {journey.contactNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(journey.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(journey.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(journey.id, 'pending')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Keep Pending
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(endIndex, pendingJourneys.length)}</span> of{' '}
                      <span className="font-medium">{pendingJourneys.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-600">No pending journeys to review</p>
          </div>
        )}
      </div>
    </div>
  )
}
