import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, BookingStatus, PaymentStatus } from '@/models/Booking';
import { razorpay, createOrder } from '@/lib/razorpay';
import mongoose from 'mongoose';
import Ride from '@/models/Ride';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rideId, seats, totalAmount, message } = body;

    if (!rideId || !seats || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate the ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      );
    }

    // Check if ride has enough available seats
    if (ride.availableSeats < seats) {
      return NextResponse.json(
        { error: `Not enough seats available. Only ${ride.availableSeats} seat(s) left.` },
        { status: 400 }
      );
    }

    // Create a Razorpay order
    const order = await createOrder(totalAmount);

    if (!order || !order.id) {
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      );
    }

    // Create a booking entry in the database
    const booking = await Booking.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      rideId: new mongoose.Types.ObjectId(rideId),
      seats,
      totalAmount,
      message,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      orderId: order.id,
      razorpayOrderId: order.id,
    });

    // Log successful booking creation
    console.log(`Booking created: ${booking._id} with Razorpay order ID: ${order.id}`);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 