// Test script for MongoDB connection
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Get the MongoDB URI from environment variables or use local MongoDB as fallback
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/carpooldb";

async function run() {
  const client = new MongoClient(uri, {
    maxPoolSize: 10
  });

  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(`Using URI: ${uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@')}`);
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    await client.close();
  }
}

run(); 