import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Ride from '@/models/Ride';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper function to calculate distance between two coordinates using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// GET /api/rides - Get all rides or search for rides
export async function GET(request: NextRequest) {
  try {
    const mongoose = await connectDB();
    
    // Ensure connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready');
    }
    
    const url = new URL(request.url);
    
    // Get query parameters for search
    const startLat = url.searchParams.get('startLat');
    const startLon = url.searchParams.get('startLon');
    const endLat = url.searchParams.get('endLat');
    const endLon = url.searchParams.get('endLon');
    const date = url.searchParams.get('date');
    const maxDistance = url.searchParams.get('maxDistance') || '10'; // Default 10km radius
    
    // Build query based on provided parameters
    const query: any = { status: 'active' };
    
    // Search for rides by date if provided
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.departureDate = {
        $gte: searchDate,
        $lt: nextDay
      };
    }
    
    // Get all rides
    let rides = await Ride.find(query)
      .populate('driver', 'name image') // Populate driver information
      .sort({ departureDate: 1, departureTime: 1 })
      .lean();
    
    // Filter rides by proximity to start and end locations if provided
    if (startLat && startLon && endLat && endLon) {
      const startLatNum = parseFloat(startLat);
      const startLonNum = parseFloat(startLon);
      const endLatNum = parseFloat(endLat);
      const endLonNum = parseFloat(endLon);
      const maxDistanceNum = parseFloat(maxDistance);
      
      rides = rides.filter(ride => {
        // Calculate distance between search start and ride start
        const startDistance = calculateDistance(
          startLatNum, 
          startLonNum, 
          ride.startLocation.lat, 
          ride.startLocation.lon
        );
        
        // Calculate distance between search end and ride end
        const endDistance = calculateDistance(
          endLatNum, 
          endLonNum, 
          ride.endLocation.lat, 
          ride.endLocation.lon
        );
        
        // Return rides with both start and end points within the max distance
        return startDistance <= maxDistanceNum && endDistance <= maxDistanceNum;
      });
    }
    
    return NextResponse.json(rides);
  } catch (error: any) {
    console.error('Error fetching rides:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rides' }, 
      { status: 500 }
    );
  }
}

// POST /api/rides - Create a new ride
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const mongoose = await connectDB();
    
    // Ensure connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready');
    }
    
    const rideData = await request.json();
    
    // Validate required fields
    if (!rideData.startLocation || !rideData.endLocation || !rideData.route || !rideData.departureDate || 
        !rideData.departureTime || !rideData.availableSeats || rideData.price === undefined || !rideData.carModel) {
      return NextResponse.json(
        { error: 'Missing required ride information' }, 
        { status: 400 }
      );
    }
    
    // Create the new ride with the authenticated user as driver
    const newRide = await Ride.create({
      ...rideData,
      driver: session.user.id, // Set the current user as the driver
    });
    
    return NextResponse.json(newRide, { status: 201 });
  } catch (error: any) {
    console.error('Error creating ride:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create ride' }, 
      { status: 500 }
    );
  }
} 