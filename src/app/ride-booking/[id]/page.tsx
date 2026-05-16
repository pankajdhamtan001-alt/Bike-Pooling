"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle, faMapMarkerAlt, faCalendarAlt, faClock, faUser, faStar, faMoneyBillWave, faShieldAlt, faArrowLeft, faInfoCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';
import BookingPayment from '@/components/BookingPayment';
import DirectPaymentButton from '@/components/DirectPaymentButton';

interface PageProps {
  params: {
    id: string;
  };
}

export default function RideBooking({ params }: PageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [seats, setSeats] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Replace mock data with state to be filled from API
  const [ride, setRide] = useState<any>({
    id: '',
    from: "",
    to: "",
    date: "",
    time: "",
    price: 0,
    seats: 1,
    description: "",
    driver: {
      name: "",
      image: "",
      rating: 0,
      rides: 0,
      joined: "",
      verified: false
    }
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push(`/login?redirect=/ride-booking/${params.id}`);
      return;
    }
    
    // Fetch ride details
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rides/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch ride details');
        }
        
        const rideData = await response.json();
        
        // Format the ride data for display
        setRide({
          id: rideData._id,
          from: rideData.startLocation.name,
          to: rideData.endLocation.name,
          date: new Date(rideData.departureDate).toLocaleDateString(),
          time: rideData.departureTime,
          price: rideData.price,
          seats: rideData.availableSeats,
          description: rideData.description || "No description provided.",
          driver: {
            name: rideData.driver?.name || "Unknown Driver",
            image: rideData.driver?.image || "https://randomuser.me/api/portraits/men/32.jpg",
            rating: rideData.driver?.rating || 4.5,
            rides: rideData.driver?.rides || 0,
            joined: rideData.driver?.joinedDate ? new Date(rideData.driver.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
            verified: true
          }
        });
        
        // Initialize default values
        setTotalPrice(rideData.price);
        
      } catch (err: any) {
        console.error('Error fetching ride details:', err);
        setError(err.message || 'Failed to load ride details');
      } finally {
        setLoading(false);
        setIsMounted(true);
      }
    };
    
    fetchRideDetails();
  }, [session, router, params.id]);

  useEffect(() => {
    // Update total price when seats change
    setTotalPrice(ride.price * seats);
  }, [seats, ride.price]);

  const handleSeatsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeats = parseInt(e.target.value);
    setSeats(newSeats);
    setTotalPrice(ride.price * newSeats);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    
    setBookingStep('payment');
    setShowPayment(true);
  };

  const handlePaymentSuccess = (bookingId: string) => {
    setBookingId(bookingId);
    setBookingStep('confirmation');
    
    // Redirect to confirmation page after 2 seconds
    setTimeout(() => {
      router.push(`/rides/booking-confirmed?id=${bookingId}`);
    }, 2000);
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    // Stay on payment page to allow retry
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-lg text-gray-600">Loading ride details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Ride</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => router.back()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isMounted || !session) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Back to search results</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Book Your Ride</h1>
                
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold">{ride.from} to {ride.to}</h2>
                    <div className="flex items-center mt-2 text-gray-600">
                      <div className="flex items-center mr-4">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-primary" />
                        <span>{ride.date}</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-primary" />
                        <span>{ride.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">₹{ride.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">per seat</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Ride Details</h3>
                  <p className="text-gray-600">{ride.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">About Your Driver</h3>
                  <div className="flex items-start">
                    <img 
                      src={ride.driver.image} 
                      alt={ride.driver.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{ride.driver.name}</h4>
                        {ride.driver.verified && (
                          <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center">
                            <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                        <span>{ride.driver.rating} · {ride.driver.rides} rides</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Member since {ride.driver.joined}</p>
                    </div>
                  </div>
                </div>
                
                {bookingStep === 'details' && (
                  <form onSubmit={handleProceedToPayment} className="space-y-6">
                    <div className="form-group">
                      <label htmlFor="seats" className="block text-gray-700 font-medium mb-2">Number of Seats</label>
                      <select 
                        id="seats"
                        value={seats}
                        onChange={handleSeatsChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {[...Array(ride.seats)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'seat' : 'seats'} (₹{(ride.price * (i + 1)).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message to Driver (Optional)</label>
                      <textarea 
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        placeholder="Introduce yourself and share any specific requirements"
                      ></textarea>
                    </div>
                    
                    <div className="form-group flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                          I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and confirm that I have adequate safety equipment
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            For your safety, we recommend communicating with the driver through our platform and wearing appropriate safety gear during the ride.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full btn btn-primary flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faBicycle} className="mr-2" />
                      Proceed to Payment
                    </button>
                  </form>
                )}

                {bookingStep === 'payment' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Complete Your Payment</h3>
                    <p className="text-gray-600 mb-4">
                      Please complete the payment to secure your booking. You'll receive a confirmation once the payment is processed.
                    </p>
                    <BookingPayment
                      rideId={params.id}
                      seats={seats}
                      totalAmount={parseFloat((totalPrice + 0.50).toFixed(2))}
                      message={message}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentFailure={handlePaymentFailure}
                    />
                    
                    {/* Fallback direct payment section if BookingPayment doesn't work */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Alternative Payment Method</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        If the payment button above doesn't work, please try this alternative method.
                      </p>
                      <DirectPaymentButton
                        rideId={params.id}
                        seats={seats}
                        totalAmount={parseFloat((totalPrice + 0.50).toFixed(2))}
                        message={message}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentFailure={handlePaymentFailure}
                      />
                    </div>
                  </div>
                )}

                {bookingStep === 'confirmation' && (
                  <div className="text-center py-8">
                    <div className="text-5xl text-green-500 mb-4">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600 mb-6">
                      Your ride has been successfully booked. Redirecting to confirmation page...
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-4 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base price:</span>
                    <span>₹{ride.price.toFixed(2)} × {seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee:</span>
                    <span>₹0.50</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200">
                    <span>Total:</span>
                    <span>₹{(totalPrice + 0.50).toFixed(2)}</span>
                  </div>
                </div>
                
                {bookingStep === 'details' && (
                  <button 
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full btn btn-primary flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faBicycle} className="mr-2" />
                    Proceed to Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 