import mongoose from 'mongoose';

const useLocalMongo = process.env.USE_LOCAL_MONGODB === 'true';

if (!process.env.MONGODB_URI && !useLocalMongo) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Use in-memory DB or remote URI based on environment variable
const MONGODB_URI = useLocalMongo 
  ? 'mongodb://localhost:27017/carpooldb' 
  : process.env.MONGODB_URI as string;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the type for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global type with mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// Memory database fallback
class MongooseInMemory {
  private collections: Record<string, any[]> = {};
  
  // Create mock methods that simulate mongoose functionality
  model(modelName: string, schema: any) {
    if (!this.collections[modelName]) {
      this.collections[modelName] = [];
    }
    
    return {
      find: () => {
        return {
          exec: async () => this.collections[modelName]
        };
      },
      findOne: (query: any) => {
        return {
          exec: async () => this.collections[modelName].find(doc => 
            Object.entries(query).every(([key, value]) => doc[key] === value)
          )
        };
      },
      create: async (doc: any) => {
        const _id = Math.random().toString(36).substring(2, 9);
        const newDoc = { ...doc, _id };
        this.collections[modelName].push(newDoc);
        return newDoc;
      }
    };
  }
}

export async function connectDB() {
  if (cached.conn) {
    // Check if the connection is still valid
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    // If connection is not ready, clear cache and try again
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Enable command buffering
      dbName: "carpooldb",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    mongoose.set('strictQuery', true);
    
    try {
      // Add connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        cached.conn = null;
        cached.promise = null;
      });

      mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        cached.conn = null;
        cached.promise = null;
      });

      cached.promise = mongoose.connect(MONGODB_URI, opts);
    } catch (error) {
      console.error('Failed to establish mongoose connection:', error);
      throw error; // Propagate the error instead of silently failing
    }
  }

  try {
    cached.conn = await cached.promise;
    
    // Wait for the connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return cached.conn;
  } catch (error) {
    console.error('Failed to establish mongoose connection:', error);
    cached.promise = null;
    cached.conn = null;
    throw error; // Propagate the error instead of silently failing
  }
} 