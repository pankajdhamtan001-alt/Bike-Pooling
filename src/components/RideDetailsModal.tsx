'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faMapMarkerAlt, faClock, faCalendarAlt, faCar, faMoneyBillWave, faStar } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import DirectPaymentButton from './DirectPaymentButton';

interface RideDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideDetails?: {
    id: string;
    driverName: string;
    driverRating: number;
    driverAvatar?: string;
    origin: string;
    destination: string;
    departureTime: string;
    departureDate: string;
    availableSeats: number;
    pricePerSeat: number;
    vehicleModel?: string;
    vehicleColor?: string;
  };
}

export default function RideDetailsModal({ isOpen, onClose, rideDetails }: RideDetailsModalProps) {
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [bookingError, setBookingError] = useState('');
  const [bookingId, setBookingId] = useState('');

  // Calculate total amount with null check
  const totalAmount = selectedSeats * (rideDetails?.pricePerSeat || 0);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setSelectedSeats(1);
      setBookingMessage('');
      setBookingStatus('idle');
      setBookingError('');
      setBookingId('');
      
      // Close any open map popups when the modal opens
      try {
        const closeButtons = document.querySelectorAll('.leaflet-popup-close-button');
        closeButtons.forEach(button => {
          (button as HTMLElement).click();
        });
      } catch (error) {
        console.error('Error closing map popups:', error);
      }
    }
  }, [isOpen]);

  // Handle successful payment
  const handlePaymentSuccess = (bookingId: string) => {
    setBookingId(bookingId);
    setBookingStatus('success');
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    setBookingError(error.message || 'Payment failed. Please try again.');
    setBookingStatus('error');
  };

  if (!isOpen || !rideDetails) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50" style={{ isolation: 'isolate' }}>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Ride details content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Ride Details</h2>

          {/* Driver information */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              {rideDetails.driverAvatar ? (
                <Image 
                  src={rideDetails.driverAvatar} 
                  alt={rideDetails.driverName} 
                  width={64} 
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FontAwesomeIcon icon={faUser} size="2x" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{rideDetails.driverName}</h3>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                <span>{rideDetails.driverRating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Ride route information */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 mt-1 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{rideDetails.origin}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mt-1 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{rideDetails.destination}</p>
              </div>
            </div>
          </div>

          {/* Ride details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{rideDetails.departureDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-indigo-500 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{rideDetails.departureTime}</p>
              </div>
            </div>
            {rideDetails.vehicleModel && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCar} className="text-indigo-500 mr-3 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">
                    {rideDetails.vehicleModel}
                    {rideDetails.vehicleColor && ` (${rideDetails.vehicleColor})`}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-indigo-500 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Price per seat</p>
                <p className="font-medium">₹{rideDetails.pricePerSeat.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Booking section */}
          {bookingStatus === 'idle' && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Book Your Ride</h3>
              
              {/* Seat selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats
                </label>
                <div className="flex items-center">
                  <select
                    value={selectedSeats}
                    onChange={(e) => setSelectedSeats(parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {[...Array(Math.min(rideDetails.availableSeats, 5))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'seat' : 'seats'}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {rideDetails.availableSeats} seats available
                </p>
              </div>

              {/* Message to driver */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Driver (Optional)
                </label>
                <textarea
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Any special requests or information for the driver..."
                />
              </div>

              {/* Total amount */}
              <div className="flex justify-between items-center mb-6 font-medium">
                <span>Total Amount</span>
                <span className="text-xl">₹{totalAmount.toFixed(2)}</span>
              </div>

              {/* Payment button */}
              <div className="mt-2">
                <DirectPaymentButton
                  rideId={rideDetails.id}
                  seats={selectedSeats}
                  totalAmount={totalAmount}
                  message={bookingMessage}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </div>
          )}

          {/* Success message */}
          {bookingStatus === 'success' && (
            <div className="border-t pt-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Booking Successful!</h3>
                <p className="text-green-600 mb-4">
                  Your ride has been booked successfully. Booking ID: {bookingId}
                </p>
                <button
                  onClick={onClose}
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {bookingStatus === 'error' && (
            <div className="border-t pt-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
                <h3 className="text-xl font-semibold text-red-700 mb-2">Booking Failed</h3>
                <p className="text-red-600 mb-4">{bookingError}</p>
                <button
                  onClick={() => setBookingStatus('idle')}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 