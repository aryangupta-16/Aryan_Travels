import { NextRequest, NextResponse } from 'next/server'

// Mock database - in a real app, this would be a database
let journeys: any[] = []

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const journeyId = params.id
    
    const journeyIndex = journeys.findIndex(j => j.id === journeyId)
    
    if (journeyIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Journey not found' },
        { status: 404 }
      )
    }
    
    journeys[journeyIndex] = {
      ...journeys[journeyIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Journey updated successfully',
      journey: journeys[journeyIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update journey' },
      { status: 500 }
    )
  }
}
