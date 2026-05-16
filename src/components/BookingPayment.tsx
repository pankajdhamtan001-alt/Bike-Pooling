import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faSpinner, faCheckCircle, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface BookingPaymentProps {
  rideId: string;
  seats: number;
  totalAmount: number;
  message: string;
  onPaymentSuccess: (bookingId: string) => void;
  onPaymentFailure: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingPayment({
  rideId,
  seats,
  totalAmount,
  message,
  onPaymentSuccess,
  onPaymentFailure
}: BookingPaymentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // Check if Razorpay script is loaded
    if (typeof window !== 'undefined' && !window.Razorpay) {
      // Add a script to load Razorpay if not already loaded from layout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        setError('Failed to load payment gateway. Please refresh and try again.');
        console.error('Failed to load Razorpay script');
      };
      document.body.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus('processing');
      setError(null);

      // Ensure Razorpay is loaded
      if (typeof window === 'undefined') {
        throw new Error('Browser environment not available');
      }

      // Wait for Razorpay to load if it's not already available
      let attempts = 0;
      while (!window.Razorpay && attempts < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        console.log(`Waiting for Razorpay to load... Attempt ${attempts}`);
      }

      if (!window.Razorpay) {
        console.error('Razorpay not available after wait');
        throw new Error('Payment gateway not loaded. Please refresh the page and try again.');
      }

      // Create booking and get order details
      const bookingResponse = await fetch('/api/bookings/create', {
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

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const bookingData = await bookingResponse.json();
      const { booking, order } = bookingData;
      
      setBookingDetails(booking);

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_B4vjKMr9afsSxB',
        amount: order.amount,
        currency: order.currency,
        name: 'Car Pool',
        description: `Payment for ${seats} seat(s) in ride`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify the payment
            const verifyResponse = await fetch('/api/bookings/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                bookingId: booking.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setPaymentStatus('success');
              onPaymentSuccess(booking.id);
            } else {
              setPaymentStatus('failed');
              setError('Payment verification failed');
              onPaymentFailure({ message: 'Payment verification failed' });
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            setError(error.message || 'Error verifying payment');
            onPaymentFailure(error);
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          contact: ''  // Add phone if available from session
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: function() {
            setPaymentStatus('idle');
            setLoading(false);
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        notes: {
          rideId: rideId,
          seats: seats.toString(),
          bookingId: booking.id
        }
      };

      const razorpay = new window.Razorpay(options);
      
      // Handle Razorpay payment errors
      razorpay.on('payment.failed', function (response: any) {
        const error = response.error || {};
        setPaymentStatus('failed');
        setError(`Payment failed: ${error.description || 'Unknown error'}`);
        onPaymentFailure(error);
      });
      
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('failed');
      setError(error.message || 'Failed to initiate payment');
      onPaymentFailure(error);
    } finally {
      setLoading(false);
    }
  };

  const retryPayment = () => {
    setPaymentStatus('idle');
    setError(null);
    // Small delay to ensure UI updates before retrying
    setTimeout(initiatePayment, 300);
  };

  return (
    <div className="mt-6">
      {paymentStatus === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl mr-3" />
          <div>
            <h4 className="font-medium text-green-800">Payment Successful!</h4>
            <p className="text-green-700 text-sm">Your booking has been confirmed.</p>
          </div>
        </div>
      ) : paymentStatus === 'failed' ? (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-center">
            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-xl mr-3" />
            <div>
              <h4 className="font-medium text-red-800">Payment Failed</h4>
              <p className="text-red-700 text-sm">{error || 'There was an issue processing your payment.'}</p>
            </div>
          </div>
          <button
            onClick={retryPayment}
            className="w-full btn btn-secondary flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
            Retry Payment
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 text-xl mr-3 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800">Secure Payment</h4>
              <p className="text-blue-700 text-sm">
                You'll be redirected to Razorpay to complete your payment securely.
                Your booking will be confirmed immediately after successful payment.
              </p>
            </div>
          </div>
          <button
            onClick={initiatePayment}
            disabled={loading || paymentStatus === 'processing'}
            className="w-full btn btn-primary flex items-center justify-center"
          >
            {loading || paymentStatus === 'processing' ? (
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
        </>
      )}
    </div>
  );
} 