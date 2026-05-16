'use client';

import PaymentButton from '@/components/PaymentButton';

export default function TestPayment() {
  const handleSuccess = () => {
    alert('Payment successful!');
  };

  const handleError = (error: any) => {
    alert('Payment failed: ' + error.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Test Razorpay Payment</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Test Payment of ₹100</h2>
        <PaymentButton 
          amount={100}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
} 