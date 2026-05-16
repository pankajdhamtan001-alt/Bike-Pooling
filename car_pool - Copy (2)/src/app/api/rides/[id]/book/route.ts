import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Ride from '@/models/Ride';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/rides/[id]/book - Book a ride as a passenger
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Find the ride
    const ride = await Ride.findById(id);
    
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    
    // Check if ride is active
    if (ride.status !== 'active') {
      return NextResponse.json(
        { error: 'This ride is no longer available for booking' }, 
        { status: 400 }
      );
    }
    
    // Check if user is trying to book their own ride
    if (ride.driver.toString() === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot book your own ride' }, 
        { status: 400 }
      );
    }
    
    // Check if user has already booked this ride
    const existingBooking = ride.passengers.find(
      passenger => passenger.user && passenger.user.toString() === session.user.id
    );
    
    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this ride' }, 
        { status: 400 }
      );
    }
    
    const { seats = 1 } = await request.json();
    
    // Calculate the total booked seats
    const totalBookedSeats = ride.passengers.reduce(
      (total, passenger) => total + passenger.seats, 0
    );
    
    // Check if there are enough available seats
    if (totalBookedSeats + seats > ride.availableSeats) {
      return NextResponse.json(
        { error: 'Not enough available seats' }, 
        { status: 400 }
      );
    }
    
    // Add the passenger to the ride
    ride.passengers.push({
      user: session.user.id,
      seats,
      status: 'pending'
    });
    
    // Save the updated ride
    await ride.save();
    
    // Populate the passenger information
    await ride.populate('passengers.user', 'name image');
    
    return NextResponse.json(ride);
  } catch (error: any) {
    console.error('Error booking ride:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/rides/[id]/book - Update booking status (for drivers to confirm/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Find the ride
    const ride = await Ride.findById(id);
    
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    
    // Check if user is the driver
    if (ride.driver.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the driver can update booking status' }, 
        { status: 403 }
      );
    }
    
    const { passengerId, status } = await request.json();
    
    if (!passengerId || !['confirmed', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid passenger ID or status' }, 
        { status: 400 }
      );
    }
    
    // Find the passenger booking
    const passengerIndex = ride.passengers.findIndex(
      passenger => passenger.user && passenger.user.toString() === passengerId
    );
    
    if (passengerIndex === -1) {
      return NextResponse.json(
        { error: 'Passenger not found in this ride' }, 
        { status: 404 }
      );
    }
    
    // Update the passenger status
    ride.passengers[passengerIndex].status = status;
    
    // Save the updated ride
    await ride.save();
    
    // Populate passenger information
    await ride.populate('passengers.user', 'name image');
    
    return NextResponse.json(ride);
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 