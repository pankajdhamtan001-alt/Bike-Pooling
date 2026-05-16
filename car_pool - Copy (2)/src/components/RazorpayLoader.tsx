'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Window {
  Razorpay: any;
}

export default function RazorpayLoader() {
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  useEffect(() => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setLoadStatus('success');
      return;
    }
    
    // Set a timeout to check if Razorpay is loaded after some time
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        setLoadStatus('success');
      } else {
        setLoadStatus('error');
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const handleScriptLoad = () => {
    setLoadStatus('success');
    console.log('Razorpay script loaded successfully');
  };
  
  const handleScriptError = () => {
    setLoadStatus('error');
    console.error('Failed to load Razorpay script');
  };
  
  return (
    <>
      <Script
        id="razorpay-checkout-js-client"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      
      {/* This is only shown in development mode for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-md shadow-lg p-3 text-sm flex items-center space-x-2">
          {loadStatus === 'loading' && (
            <>
              <FontAwesomeIcon icon={faSpinner} className="text-blue-500 animate-spin" />
              <span>Loading Razorpay...</span>
            </>
          )}
          {loadStatus === 'success' && (
            <>
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              <span>Razorpay loaded</span>
            </>
          )}
          {loadStatus === 'error' && (
            <>
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
              <span>Failed to load Razorpay</span>
            </>
          )}
        </div>
      )}
    </>
  );
} 