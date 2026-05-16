"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCalendarAlt, faClock, faUser, faMapMarkerAlt, faTicketAlt, faArrowLeft, faDownload, faShare } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function BookingConfirmed() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push('/login?redirect=/rides/booking-confirmed');
      return;
    }

    if (!bookingId) {
      setError('Booking ID not found');
      setLoading(false);
      return;
    }

    // Get booking details from API
    const fetchBooking = async () => {
      try {
        setLoading(true);
        
        // For demonstration purposes, we'll use a mock response
        // In a real app, you would make an API call like:
        // const response = await fetch(`/api/bookings/${bookingId}`);
        // if (!response.ok) throw new Error('Failed to fetch booking');
        // const data = await response.json();
        // setBooking(data.booking);
        
        // Mock response for demo
        setTimeout(() => {
          setBooking({
            id: bookingId,
            status: 'confirmed',
            paymentStatus: 'completed',
            seats: 2,
            totalAmount: 11.50,
            ride: {
              id: 123,
              from: "Downtown",
              to: "University Campus",
              date: "2025-03-15",
              time: "08:30",
              driver: {
                name: "Alex Johnson",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                phone: "+1 (555) 123-4567"
              }
            },
            bookingCode: "RB" + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toISOString()
          });
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to fetch booking details');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [session, router, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-4" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
              <h1 className="text-xl font-semibold text-red-700 mb-2">Booking Not Found</h1>
              <p className="text-red-600 mb-4">{error || "We couldn't find the booking details you're looking for."}</p>
              <Link href="/rides" className="btn btn-primary">
                View All Rides
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/rides" className="flex items-center text-gray-600 hover:text-primary transition-colors">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Back to my rides</span>
            </Link>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-500 p-6 text-center text-white">
                <FontAwesomeIcon icon={faCheckCircle} className="text-5xl mb-3" />
                <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
                <p className="text-white/80 mt-1">Your ride has been successfully booked and payment completed.</p>
              </div>
              
              <div className="p-6">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Ride Details</h2>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                      {booking.status}
                    </span>
                    <span className="mx-2">•</span>
                    <span>Booking ID: {booking.id.substring(0, 8)}...</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm mb-1">From - To</div>
                      <div className="font-medium">
                        {booking.ride.from} → {booking.ride.to}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm mb-1">Date & Time</div>
                      <div className="font-medium flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-primary mr-2" />
                        {booking.ride.date}
                        <span className="mx-2">|</span>
                        <FontAwesomeIcon icon={faClock} className="text-primary mr-2" />
                        {booking.ride.time}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm mb-1">Driver</div>
                      <div className="font-medium flex items-center">
                        <img 
                          src={booking.ride.driver.image} 
                          alt={booking.ride.driver.name} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        {booking.ride.driver.name}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm mb-1">Booking Code</div>
                      <div className="font-medium flex items-center">
                        <FontAwesomeIcon icon={faTicketAlt} className="text-primary mr-2" />
                        {booking.bookingCode}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm mb-1">Seats</div>
                      <div className="font-medium flex items-center">
                        <FontAwesomeIcon icon={faUser} className="text-primary mr-2" />
                        {booking.seats} {booking.seats === 1 ? 'seat' : 'seats'}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-gray-500 text-sm mb-1">Total Paid</div>
                      <div className="font-medium text-green-700">
                        ₹{booking.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="bg-blue-50 rounded-md p-4 text-blue-700 text-sm mb-4">
                    <p>
                      <strong>Important:</strong> Show your booking code to the driver before starting the ride. 
                      You can contact the driver at {booking.ride.driver.phone} if needed.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center mt-6">
                    <button className="btn btn-outline-primary flex items-center">
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      Download Receipt
                    </button>
                    <button className="btn btn-outline-primary flex items-center">
                      <FontAwesomeIcon icon={faShare} className="mr-2" />
                      Share Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/rides" className="btn btn-primary">
                View My Bookings
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}