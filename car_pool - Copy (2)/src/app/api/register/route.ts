import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectDB } from '../../../lib/mongoose-fallback';
import User from '../../../models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    const { name, email, password } = await request.json();
    console.log('Registration data:', { name, email, hasPassword: !!password });

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { hasName: !!name, hasEmail: !!email, hasPassword: !!password });
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Connect to the database and ensure connection is established
    console.log('Attempting to connect to database...');
    const mongoose = await connectDB();
    
    // Wait for the connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('Database connected successfully');

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email }).lean();
    
    if (existingUser) {
      console.log('User already exists with email:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log('User created successfully:', { userId: user._id, email: user.email });

    // Return the user (excluding password)
    const responseUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { success: true, message: 'User registered successfully', user: responseUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { success: false, error: error.message || 'Error registering user' },
      { status: 500 }
    );
  }
} 