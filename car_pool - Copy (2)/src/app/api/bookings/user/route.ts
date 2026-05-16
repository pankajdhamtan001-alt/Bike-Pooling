import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

type BookingDocument = {
  _id: string;
  userId: string;
  rideId: any;
  seats: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('Connecting to database...');
    // Connect to database with timeout
    await Promise.race([
      connectDB(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 10000)
      )
    ]);
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    // Build query
    const query: any = { userId };
    
    if (status) {
      query.status = status;
    }
    
    console.log('Fetching bookings for user:', userId);
    
    // Fetch user's bookings with populated ride details and timeout
    const result = await Promise.race([
      Booking.find(query)
        .populate({
          path: 'rideId',
          populate: {
            path: 'driver',
            select: 'name image rating'
          }
        })
        .sort({ createdAt: -1 })
        .lean(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 10000)
      )
    ]) as unknown as BookingDocument[];
    
    console.log('Found bookings:', result.length);
    
    // Return empty array if no bookings found
    if (!result) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    
    // Handle specific error types
    if (error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 