'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from '../lib/api'
import { useForm } from 'react-hook-form'

interface JourneyForm {
  name: string
  email: string
  contactNumber: string
  travelMode: 'flight' | 'train'
  source: string
  destination: string
}

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad'
]

export default function HomePage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<JourneyForm>()

  useEffect(() => {
    async function fetchUserRole() {
      const profile = await getProfile()
      if (!profile || profile.error || profile.message === 'Unauthorized') {
        router.push('/home')
      } else {
        setUserRole(profile.email === 'admin@example.com' ? 'admin' : 'user')
        setUserEmail(profile.email)
        setIsLoading(false)
      }
    }
    fetchUserRole()
  }, [router])

  const onSubmit = async (data: JourneyForm) => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch('/api/journeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // userId: session?.user?.id,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitMessage('Journey booked successfully! You can view it in your profile.')
        // Reset form except prefilled fields
        setValue('contactNumber', '')
        setValue('travelMode', 'flight')
        setValue('source', '')
        setValue('destination', '')
      } else {
        setSubmitMessage('Failed to book journey. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // if (!session) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Journey</h1>
        <p className="text-gray-600 mb-8">Fill in the details below to book your travel</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="input-field"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="input-field"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              {...register('contactNumber', { 
                required: 'Contact number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              type="tel"
              className="input-field"
              placeholder="Enter your 10-digit phone number"
            />
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="travelMode" className="block text-sm font-medium text-gray-700 mb-2">
              Travel Mode
            </label>
            <select
              {...register('travelMode', { required: 'Please select a travel mode' })}
              className="input-field"
            >
              <option value="">Select travel mode</option>
              <option value="flight">Flight</option>
              <option value="train">Train</option>
            </select>
            {errors.travelMode && (
              <p className="mt-1 text-sm text-red-600">{errors.travelMode.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                Source City
              </label>
              <select
                {...register('source', { required: 'Please select source city' })}
                className="input-field"
              >
                <option value="">Select source city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.source && (
                <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Destination City
              </label>
              <select
                {...register('destination', { required: 'Please select destination city' })}
                className="input-field"
              >
                <option value="">Select destination city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
              )}
            </div>
          </div>

          {submitMessage && (
            <div className={`p-4 rounded-lg ${
              submitMessage.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {submitMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Booking Journey...' : 'Book Journey'}
          </button>
        </form>
      </div>
    </div>
  )
}
