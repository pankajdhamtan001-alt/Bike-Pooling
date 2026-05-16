import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    const order = await createOrder(amount);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in create-payment route:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
} 