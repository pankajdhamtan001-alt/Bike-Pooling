"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBicycle, faMapMarkerAlt, faCalendarAlt, faClock, 
  faUser, faStar, faEye, faEdit, faTrash, faBan, 
  faExclamationTriangle, faSpinner, faTicketAlt, faBus
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

// Define types for our data
interface Driver {
  _id: string;
  name: string;
  image?: string;
  rating: number;
}

interface Ride {
  _id: string;
  startLocation: {
    name: string;
    display_name: string;
  };
  endLocation: {
    name: string;
    display_name: string;
  };
  departureDate: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  driver: Driver;
}

interface Booking {
  _id: string;
  userId: string;
  rideId: Ride;
  seats: number;
  totalAmount: number;
  message?: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyRides() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for real bookings data
  const [bookings, setBookings] = useState<{
    upcoming: Booking[];
    past: Booking[];
  }>({
    upcoming: [],
    past: []
  });

  // Function to fetch user bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching bookings...');
      
      // Get all bookings
      const res = await fetch('/api/bookings/user', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        let errorText = `Failed to fetch bookings: ${res.status} ${res.statusText}`;
        
        try {
          const errorData = await res.json();
          console.error('Error response:', errorData);
          errorText += ` ${errorData.error || ''}`;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        throw new Error(errorText);
      }
      
      // Parse the response body as text first to debug any JSON parsing issues
      const responseText = await res.text();
      console.log('Response text:', responseText.substring(0, 100) + '...');
      
      let data;
      try {
        // Now parse as JSON
        data = JSON.parse(responseText);
        console.log('Received bookings data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid JSON response from server');
      }
      
      // Separate bookings into upcoming and past
      const currentDate = new Date();
      const upcoming: Booking[] = [];
      const past: Booking[] = [];
      
      // Handle the case where data might be empty or not an array
      if (!data || !Array.isArray(data)) {
        console.error('Unexpected bookings data format:', data);
        setBookings({ upcoming: [], past: [] });
        setError('Received invalid booking data from server');
        return;
      }
      
      data.forEach((booking: Booking) => {
        // Check if booking has rideId (it should be populated by the API)
        if (!booking.rideId) {
          console.warn('Booking missing rideId:', booking);
          return;
        }
        
        const rideDate = new Date(`${booking.rideId.departureDate}T${booking.rideId.departureTime}`);
        
        // If booking status is 'cancelled', add to past rides
        if (booking.status === 'cancelled') {
          past.push(booking);
          return;
        }
        
        // If ride date is in the future or today, add to upcoming
        if (
          rideDate > currentDate || 
          (rideDate.getDate() === currentDate.getDate() && 
           rideDate.getMonth() === currentDate.getMonth() && 
           rideDate.getFullYear() === currentDate.getFullYear())
        ) {
          upcoming.push(booking);
        } else {
          past.push(booking);
        }
      });
      
      setBookings({
        upcoming,
        past
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel a booking
  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      if (!res.ok) {
        throw new Error('Failed to cancel booking');
      }
      
      // Refresh bookings after cancellation
      await fetchBookings();
      
      // Show success message
      alert('Booking cancelled successfully');
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Failed to cancel booking');
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Function to get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
            Payment Pending
          </span>
        );
      case 'failed':
        return (
          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
            Payment Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Load user bookings on component mount
  useEffect(() => {
    // Redirect if not logged in
    if (sessionStatus === 'unauthenticated' && typeof window !== 'undefined') {
      router.push('/login?redirect=/rides');
      return;
    }
    
    // Fetch bookings if user is authenticated
    if (sessionStatus === 'authenticated') {
      fetchBookings();
    }
  }, [sessionStatus, router]);

  // Show loading state while session is loading
  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-gray-600 mb-4" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Protected page content
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Rides</h1>
                <p className="text-gray-600 mt-1">Manage your upcoming and past rides</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Link 
                  href="/find-ride" 
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded flex items-center"
                >
                  <FontAwesomeIcon icon={faBicycle} className="mr-2" />
                  Find a Ride
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button 
                    className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                      activeTab === 'upcoming' 
                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Upcoming Rides
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                      activeTab === 'past' 
                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('past')}
                  >
                    Past Rides
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-gray-600 mb-2" />
                    <span className="text-gray-600">Loading your rides...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="p-6 bg-red-50 text-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl mb-2" />
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={fetchBookings}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Try Again
                  </button>
                </div>
              ) : bookings[activeTab as keyof typeof bookings].length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl text-gray-300 mb-4">
                    <FontAwesomeIcon icon={faBicycle} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No {activeTab} rides</h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'upcoming' 
                      ? "You don't have any upcoming rides. Start by searching for rides."
                      : "You haven't taken any rides yet. Start exploring options today!"}
                  </p>
                  {activeTab === 'upcoming' && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        href="/find-ride" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
                      >
                        Find a Ride
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {bookings[activeTab as keyof typeof bookings].map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3 space-x-3">
                            {getStatusBadge(booking.status)}
                            {getPaymentStatusBadge(booking.paymentStatus)}
                            <span className="ml-auto text-sm text-gray-500">
                              Booked on {formatDate(booking.createdAt)}
                            </span>
                          </div>
                          
                          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                              <div className="text-green-500 mt-1 mr-3">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">From</p>
                                <p className="font-medium">{booking.rideId.startLocation.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="text-red-500 mt-1 mr-3">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">To</p>
                                <p className="font-medium">{booking.rideId.endLocation.name}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center">
                              <div className="text-gray-600 mr-2">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </div>
                              <span>{formatDate(booking.rideId.departureDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="text-gray-600 mr-2">
                                <FontAwesomeIcon icon={faClock} />
                              </div>
                              <span>{booking.rideId.departureTime}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="text-gray-600 mr-2">
                                <FontAwesomeIcon icon={faTicketAlt} />
                              </div>
                              <span>{booking.seats} seat(s)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="text-gray-600 mr-2">
                                <FontAwesomeIcon icon={faBus} />
                              </div>
                              <span>₹{booking.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                              {booking.rideId.driver?.image ? (
                                <Image 
                                  src={booking.rideId.driver.image} 
                                  alt={booking.rideId.driver.name} 
                                  width={32} 
                                  height={32}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  <FontAwesomeIcon icon={faUser} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{booking.rideId.driver?.name || 'Driver'}</p>
                              {booking.rideId.driver?.rating && (
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs mr-1" />
                                  <span className="text-sm text-gray-600">{booking.rideId.driver.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex mt-4 md:mt-0 md:ml-4 space-x-2">
                          <Link
                            href={`/ride-details/${booking.rideId._id}`}
                            className="btn btn-sm btn-outline py-1 px-3 flex items-center text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-1" />
                            Details
                          </Link>
                          
                          {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="btn btn-sm btn-outline-danger py-1 px-3 flex items-center text-sm border border-red-300 rounded text-red-600 hover:bg-red-50"
                            >
                              <FontAwesomeIcon icon={faBan} className="mr-1" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 