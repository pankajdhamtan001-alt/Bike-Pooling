import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority' as const,
};

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    console.log('Using URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Log URI without credentials
    
    // Connect to MongoDB
    await mongoose.connect(uri, options);
    
    // Import models to ensure they are registered
    await import('../models/Ride');
    await import('../models/Booking');
    await import('../models/User');
    
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error);
    
    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED') {
      if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
        throw new Error(
          'Could not connect to local MongoDB. Please ensure MongoDB is running locally or use MongoDB Atlas connection string.'
        );
      } else {
        throw new Error(
          'Could not connect to MongoDB Atlas. Please check your connection string and network connection.'
        );
      }
    }
    
    throw error;
  }
}

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
}); 