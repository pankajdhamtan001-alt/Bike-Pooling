import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Ride from '@/models/Ride';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/rides/[id] - Get a single ride by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await connectDB();
    
    const ride = await Ride.findById(id)
      .populate('driver', 'name email image')
      .populate('passengers.user', 'name image');
    
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    
    return NextResponse.json(ride);
  } catch (error: any) {
    console.error('Error fetching ride:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/rides/[id] - Update a ride
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
    
    // Check if the authenticated user is the driver
    if (ride.driver.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the driver can update this ride' }, 
        { status: 403 }
      );
    }
    
    const updateData = await request.json();
    
    // Update the ride
    const updatedRide = await Ride.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedRide);
  } catch (error: any) {
    console.error('Error updating ride:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/rides/[id] - Delete a ride
export async function DELETE(
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
    
    // Check if the authenticated user is the driver
    if (ride.driver.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the driver can delete this ride' }, 
        { status: 403 }
      );
    }
    
    // Delete the ride
    await Ride.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Ride deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting ride:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 