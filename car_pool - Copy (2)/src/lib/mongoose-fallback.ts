import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';
const useLocalMongo = process.env.USE_LOCAL_MONGODB === 'true';

if (!MONGODB_URI && !useLocalMongo) {
  throw new Error('Please add your MONGODB_URI or enable USE_LOCAL_MONGODB in .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    // If we have a connection, check if it's still valid
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    // If the connection is not ready, clear the cache and try again
    cached.conn = null;
    cached.promise = null;
  }

  try {
    // First try using the provided connection URI
    let connectionUri = useLocalMongo ? 'mongodb://127.0.0.1:27017/carpooldb' : MONGODB_URI;
    console.log(`Attempting MongoDB connection to: ${connectionUri}`);
    
    const opts = {
      bufferCommands: true,
      dbName: "carpooldb",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    mongoose.set('strictQuery', true);
    
    // Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    cached.promise = mongoose.connect(connectionUri, opts);
    cached.conn = await cached.promise;
    
    // Wait for the connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('MongoDB connected successfully');
    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // If first attempt failed and we weren't using local fallback, try local
    if (!useLocalMongo) {
      console.log('Trying local MongoDB fallback...');
      try {
        // Clear cached promise to retry with local
        cached.promise = null;
        
        // Set fallback flag and try again
        process.env.USE_LOCAL_MONGODB = 'true';
        return connectDB();
      } catch (fallbackError) {
        console.error('Local MongoDB fallback also failed:', fallbackError);
      }
    }
    
    // Development-only fallback - create fake connection
    if (process.env.NODE_ENV === 'development') {
      console.warn('All MongoDB connection attempts failed, creating dummy connection for development');
      
      // Create a fake connection just for development
      // This is for development only and will allow the app to run without MongoDB
      cached.conn = mongoose;
      cached.promise = Promise.resolve(mongoose);
      
      return mongoose;
    }
    
    // In production, we should fail
    throw error;
  }
} 