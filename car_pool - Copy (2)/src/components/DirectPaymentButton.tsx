'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface DirectPaymentButtonProps {
  rideId: string;
  seats: number;
  totalAmount: number;
  message?: string;
  onSuccess: (bookingId: string) => void;
  onError: (error: any) => void;
}

export default function DirectPaymentButton({
  rideId,
  seats,
  totalAmount,
  message = '',
  onSuccess,
  onError
}: DirectPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create a direct booking
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rideId,
          seats,
          totalAmount,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      
      // If we have window.Razorpay available, open payment directly
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_B4vjKMr9afsSxB',
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Car Pool',
          description: `Payment for ${seats} seat(s) in ride`,
          order_id: data.order.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch('/api/bookings/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                bookingId: data.booking.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            
            if (verifyResponse.ok) {
              onSuccess(data.booking.id);
            } else {
              const errorData = await verifyResponse.json();
              onError(new Error(errorData.error || 'Payment verification failed'));
            }
          },
          prefill: {
            // These will be filled from the session in the component where this is used
          },
          theme: {
            color: '#4F46E5',
          },
        };
        
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        throw new Error('Payment gateway not loaded. Please try refreshing the page.');
      }
    } catch (error: any) {
      console.error('Direct payment error:', error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          Processing...
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
          Pay Now (₹{totalAmount.toFixed(2)})
        </>
      )}
    </button>
  );
} 