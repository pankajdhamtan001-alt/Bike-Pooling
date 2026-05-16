import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, BookingStatus, PaymentStatus } from '@/models/Booking';
import Ride from '@/models/Ride';
import crypto from 'crypto';

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
    const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!bookingId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify that the session user owns this booking
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to verify this booking' },
        { status: 403 }
      );
    }

    // Verify the Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'xkSJh4J2txZuJkSbha9Mbikb';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generated_signature !== razorpaySignature) {
      // Update booking as failed if signature doesn't match
      booking.paymentStatus = PaymentStatus.FAILED;
      await booking.save();
      
      return NextResponse.json(
        { error: 'Payment verification failed', success: false },
        { status: 400 }
      );
    }

    // If we get here, payment is verified
    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpayOrderId = razorpayOrderId;
    booking.razorpaySignature = razorpaySignature;
    booking.paymentStatus = PaymentStatus.COMPLETED;
    booking.status = BookingStatus.CONFIRMED;
    await booking.save();

    // Update ride's available seats
    try {
      const ride = await Ride.findById(booking.rideId);
      if (ride) {
        ride.availableSeats = Math.max(0, ride.availableSeats - booking.seats);
        await ride.save();
        console.log(`Updated ride ${ride._id} - ${booking.seats} seat(s) booked, ${ride.availableSeats} remaining`);
      }
    } catch (error) {
      console.error(`Failed to update ride seats: ${error}`);
      // Don't fail the request if this update fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 