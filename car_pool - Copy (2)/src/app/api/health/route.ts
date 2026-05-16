import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongoose-fallback';
import clientPromise from '../../../lib/mongodb-fallback';

export async function GET() {
  try {
    // Try to connect with Mongoose
    const mongooseConn = await connectDB();
    
    // Try to connect with MongoDB client
    const mongoClient = await clientPromise;
    const isConnected = !!mongoClient;
    
    return NextResponse.json({
      status: 'ok',
      mongooseConnected: !!mongooseConn,
      mongoClientConnected: isConnected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 