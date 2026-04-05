import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * API route to verify the database connection.
 * Responds with a JSON object indicating success or failure.
 */
export async function GET() {
  try {
    // Attempt a simple query (e.g., counting users)
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection verified!',
      data: { userCount }
    })
  } catch (error) {
    console.error('Database connection failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to the database.',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
