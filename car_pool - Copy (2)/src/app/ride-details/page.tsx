'use client';

import { useState } from 'react';
import RideDetailsModal from '@/components/RideDetailsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

// Example ride data
const sampleRide = {
  id: 'ride_12345',
  driverName: 'Rahul Sharma',
  driverRating: 4.8,
  driverAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  origin: 'Indiranagar, Bangalore',
  destination: 'Electronic City, Bangalore',
  departureTime: '08:30 AM',
  departureDate: 'June 15, 2023',
  availableSeats: 3,
  pricePerSeat: 180,
  vehicleModel: 'Honda City',
  vehicleColor: 'Silver'
};

export default function RideDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Ride Details Demo</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Ride Information</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Preview of ride details with payment integration.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Route</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">From:</span>
                    <p className="mt-1">{sampleRide.origin}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">To:</span>
                    <p className="mt-1">{sampleRide.destination}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Departure:</span>
                    <p className="mt-1">{sampleRide.departureDate} at {sampleRide.departureTime}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Price per seat:</span>
                    <p className="mt-1">₹{sampleRide.pricePerSeat.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={openModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                View Ride Details & Book
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Demo Information</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This is a demonstration of the RideDetailsModal component with Razorpay integration.
                  For testing purposes, the payment gateway is in test mode.
                </p>
                <p className="mt-2">
                  You can use Razorpay test card number: 4111 1111 1111 1111
                </p>
                <p>
                  Expiry: Any future date | CVV: Any 3 digits
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Go back to home page
          </Link>
        </div>
      </main>

      {/* Ride Details Modal */}
      <RideDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        rideDetails={sampleRide}
      />
    </div>
  );
} 