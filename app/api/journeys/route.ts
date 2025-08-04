import { NextRequest, NextResponse } from 'next/server'

// Mock database - in a real app, this would be a database
let journeys: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newJourney = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    
    journeys.push(newJourney)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Journey booked successfully',
      journey: newJourney 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to book journey' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')
  
  let filteredJourneys = journeys
  
  if (userId) {
    filteredJourneys = filteredJourneys.filter(j => j.userId === userId)
  }
  
  if (status) {
    filteredJourneys = filteredJourneys.filter(j => j.status === status)
  }
  
  return NextResponse.json({ journeys: filteredJourneys })
}
