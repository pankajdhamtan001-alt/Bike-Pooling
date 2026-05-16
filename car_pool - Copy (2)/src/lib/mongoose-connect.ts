import mongoose from 'mongoose';
import clientPromise from './mongodb-fallback';

// Define the global namespace
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    isConnected: boolean;
  } | undefined;
}

// Initialize the global mongoose connection cache
const globalMongoose = global._mongoose || {
  conn: null,
  promise: null,
  isConnected: false
};

// Ensure the global object is initialized
global._mongoose = globalMongoose;

// Function to connect to MongoDB using Mongoose
export async function connectToDatabase() {
  try {
    // If we already have a connection and it's connected, return it
    if (globalMongoose.conn && globalMongoose.isConnected) {
      console.log('[mongoose-connect] Reusing existing mongoose connection');
      return globalMongoose.conn;
    }

    // If we're reconnecting
    if (mongoose.connection.readyState === 1) {
      console.log('[mongoose-connect] Mongoose is already connected');
      globalMongoose.conn = mongoose;
      globalMongoose.isConnected = true;
      return mongoose;
    }

    console.log('[mongoose-connect] Creating new mongoose connection...');
    
    // IMPORTANT: Always set bufferCommands to true to avoid the error
    mongoose.set('bufferCommands', true);
    
    // Default database URI
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carpooldb';
    
    if (!globalMongoose.promise) {
      // Create the connection with bufferCommands true to avoid the error
      globalMongoose.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: true, // This prevents the "before connection complete" error
      });
      
      console.log('[mongoose-connect] Connection promise created');
    }

    // Wait for the mongoose connection promise to resolve
    console.log('[mongoose-connect] Awaiting connection...');
    globalMongoose.conn = await globalMongoose.promise;
    
    // Mark as connected
    globalMongoose.isConnected = true;
    console.log('[mongoose-connect] MongoDB connected via Mongoose successfully');
    
    // Handle connection events for better debugging
    mongoose.connection.on('error', (err) => {
      console.error('[mongoose-connect] MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('[mongoose-connect] MongoDB disconnected');
      globalMongoose.isConnected = false;
    });
    
    return globalMongoose.conn;
  } catch (e) {
    console.error('[mongoose-connect] Error connecting to MongoDB via Mongoose:', e);
    
    // Create a minimal connection anyway - the mongodb-fallback should handle mockup
    if (!globalMongoose.conn) {
      // Let's avoid the bufferCommands=false issue by setting it to true
      mongoose.set('bufferCommands', true);
      
      // Try a minimal connection as a last resort
      try {
        await mongoose.connect('mongodb://localhost:27017/carpooldb', {
          bufferCommands: true,
        });
        console.log('[mongoose-connect] Created minimal fallback connection');
      } catch (fallbackError) {
        console.error('[mongoose-connect] Even fallback connection failed:', fallbackError);
      }
      
      globalMongoose.conn = mongoose;
    }
    
    return globalMongoose.conn;
  }
}

export default connectToDatabase; 