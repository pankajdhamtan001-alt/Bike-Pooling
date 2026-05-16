import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose-connect';
import { Booking, BookingStatus } from '@/models/Booking';
import Ride from '@/models/Ride';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET a single booking by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('[API/bookings/id] Connecting to database...');
    
    try {
      // Connect to database with Mongoose - make sure to await the connection
      await connectToDatabase();
      console.log('[API/bookings/id] Database connection successful');
      
      // Find the booking
      const booking = await Booking.findById(id)
        .populate({
          path: 'rideId',
          populate: {
            path: 'driver',
            select: 'name image rating'
          }
        });
      
      console.log('[API/bookings/id] Booking query result:', booking ? 'Found' : 'Not found');
      
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      
      // Check if the user owns this booking
      if (booking.userId.toString() !== session.user.id && 
          booking.rideId.driver._id.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'You do not have permission to view this booking' },
          { status: 403 }
        );
      }
      
      return NextResponse.json(booking);
    } catch (dbError: any) {
      console.error('[API/bookings/id] Database query error:', dbError);
      return NextResponse.json(
        { error: `Database query error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API/bookings/id] Error fetching booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PATCH to update a booking (cancel, etc.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('[API/bookings/id] Connecting to database for update...');
    
    try {
      // Connect to database with Mongoose - make sure to await the connection
      await connectToDatabase();
      console.log('[API/bookings/id] Database connection successful for update');
      
      // Get request body
      const data = await req.json();
      
      console.log('[API/bookings/id] Updating booking:', id, 'with data:', data);
      
      // Find the booking
      const booking = await Booking.findById(id);
      
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      
      // Check if the user owns this booking
      if (booking.userId.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'You do not have permission to update this booking' },
          { status: 403 }
        );
      }
      
      // Update fields (currently only supporting status changes)
      if (data.status) {
        // Check if status is valid
        if (!Object.values(BookingStatus).includes(data.status)) {
          return NextResponse.json(
            { error: 'Invalid booking status' },
            { status: 400 }
          );
        }
        
        // Check if we're cancelling a booking
        if (data.status === BookingStatus.CANCELLED && booking.status !== BookingStatus.CANCELLED) {
          try {
            // Update ride's available seats (add back the seats that were booked)
            const ride = await Ride.findById(booking.rideId);
            if (ride) {
              ride.availableSeats += booking.seats;
              await ride.save();
              console.log('[API/bookings/id] Updated ride available seats:', ride.availableSeats);
            } else {
              console.log('[API/bookings/id] Ride not found for booking:', booking.rideId);
            }
          } catch (rideError: any) {
            console.error('[API/bookings/id] Error updating ride seats:', rideError);
            // Continue with booking update even if ride update fails
          }
        }
        
        booking.status = data.status;
      }
      
      await booking.save();
      console.log('[API/bookings/id] Booking updated successfully');
      
      return NextResponse.json(booking);
    } catch (dbError: any) {
      console.error('[API/bookings/id] Database operation error:', dbError);
      return NextResponse.json(
        { error: `Database operation error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API/bookings/id] Error updating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
} 