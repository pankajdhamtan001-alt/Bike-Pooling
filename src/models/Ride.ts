import mongoose, { Schema, models, Document } from 'mongoose';

// Define the location schema for start and end locations
const locationSchema = new Schema({
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  display_name: {
    type: String,
    required: true,
  }
});

// Define the route schema for storing the route geometry
const routeSchema = new Schema({
  type: {
    type: String,
    enum: ['LineString'],
    required: true,
  },
  coordinates: {
    type: [[Number]], // Array of [longitude, latitude] pairs
    required: true,
  },
  distance: {
    type: Number, // Distance in meters
    required: true,
  },
  duration: {
    type: Number, // Duration in seconds
    required: true,
  },
});

// Define the ride schema
const rideSchema = new Schema({
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startLocation: {
    type: locationSchema,
    required: true,
  },
  endLocation: {
    type: locationSchema,
    required: true,
  },
  route: {
    type: routeSchema,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: String, // Store as HH:MM format
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  carModel: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  passengers: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    seats: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
      default: 'pending',
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for efficient querying
rideSchema.index({ 'startLocation.lat': 1, 'startLocation.lon': 1 });
rideSchema.index({ 'endLocation.lat': 1, 'endLocation.lon': 1 });
rideSchema.index({ departureDate: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ driver: 1 });

// Check if the model exists before creating a new one
const Ride = models.Ride || mongoose.model('Ride', rideSchema);

export default Ride; 