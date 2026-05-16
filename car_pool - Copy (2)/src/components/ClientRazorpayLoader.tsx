'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false is only allowed in client components
const RazorpayLoader = dynamic(() => import('./RazorpayLoader'), { 
  ssr: false 
});

export default function ClientRazorpayLoader() {
  return <RazorpayLoader />;
} 