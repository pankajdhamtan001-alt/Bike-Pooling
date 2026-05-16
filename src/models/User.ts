import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model exists before creating a new one
// This prevents overwriting the model during hot reloading
const User = models.User || mongoose.model('User', userSchema);

export default User; 