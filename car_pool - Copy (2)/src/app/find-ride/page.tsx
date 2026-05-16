"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faClock, 
  faUser, 
  faSearch, 
  faInfoCircle,
  faFilter,
  faRoute,
  faLocationDot,
  faArrowRight,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { getRoute } from '@/utils/geocoding';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MapPlaceholder from '@/components/MapPlaceholder';
import SearchMap from '@/components/SearchMap';

// Dynamically import the map components with no SSR
const RouteMap = dynamic(() => import('@/components/RouteMap'), { 
  ssr: false,
  loading: () => <MapPlaceholder message="Loading route map..." />
});

const RideRouteMap = dynamic(() => import('@/components/RideRouteMap'), { 
  ssr: false,
  loading: () => <MapPlaceholder message="Loading rides map..." />
});

const RideDetailsModal = dynamic(() => import('@/components/RideDetailsModal'), { ssr: false });
const InteractiveMapSelector = dynamic(() => import('@/components/InteractiveMapSelector'), { 
  ssr: false,
  loading: () => <MapPlaceholder message="Loading map selector..." />
});

interface Location {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
}

export default function FindRidePage() {
  // Form state
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState('12:00'); // Default to noon
  const [seats, setSeats] = useState(1);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'form' | 'map'>('form');
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [rides, setRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showRideDetails, setShowRideDetails] = useState(false);
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Get today's date in YYYY-MM-DD format for the date input default value
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Fetch route when start and end locations are set
  useEffect(() => {
    const fetchRoute = async () => {
      if (startLocation && endLocation) {
        setIsLoadingRoute(true);
        setRouteError('');
        
        try {
          const data = await getRoute(
            startLocation.lat,
            startLocation.lon,
            endLocation.lat,
            endLocation.lon
          );
          
          if (data && data.routes && data.routes.length > 0) {
            setRouteData(data);
            setDistance(data.routes[0].distance);
            setDuration(data.routes[0].duration);
          } else {
            setRouteError('Could not find a route between these locations.');
          }
        } catch (err) {
          console.error('Error fetching route:', err);
          setRouteError('Failed to load route data. Please try again.');
        } finally {
          setIsLoadingRoute(false);
        }
      }
    };

    fetchRoute();
  }, [startLocation, endLocation]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startLocation || !endLocation) {
      alert('Please select both start and destination locations');
      return;
    }
    
    setIsSearching(true);
    setSearchPerformed(true);
    setRides([]); // Clear previous results
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        startLat: startLocation.lat.toString(),
        startLon: startLocation.lon.toString(),
        endLat: endLocation.lat.toString(),
        endLon: endLocation.lon.toString(),
        date,
        time
      });

      // Add passenger count if greater than 1
      if (seats > 1) {
        params.append('seats', seats.toString());
      }

      // Fetch rides matching the search criteria
      const response = await fetch(`/api/rides?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch rides");
      }

      const data = await response.json();
      
      if (data.length === 0) {
        // No rides found
        setRides([]);
      } else {
        setRides(data);
      }
    } catch (error) {
      console.error("Error searching for rides:", error);
      alert(`Error searching for rides: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle clicking on a ride
  const handleRideClick = async (rideId: string) => {
    try {
      const response = await fetch(`/api/rides/${rideId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch ride details");
      }

      const data = await response.json();
      setSelectedRide(data);
      setShowRideDetails(true);
    } catch (error) {
      console.error("Error fetching ride details:", error);
    }
  };
  
  // Format the distance and duration for display
  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} min`;
    }
    
    return `${hours} hr ${minutes} min`;
  };
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Find a Ride</h1>
          
          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <LocationAutocomplete
                    label="Start Location"
                    placeholder="Enter start location"
                    onChangeAction={setStartLocation}
                    required
                    isStart
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <LocationAutocomplete
                    label="Destination"
                    placeholder="Enter destination"
                    onChangeAction={setEndLocation}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seats
                  </label>
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Search Rides'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          {rides.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Maps Section */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Route Overview</h2>
                  <RideRouteMap 
                    rides={rides} 
                    height="300px"
                    onRideClick={handleRideClick}
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Interactive Map</h2>
                  <SearchMap 
                    startLocation={startLocation}
                    endLocation={endLocation}
                    height="300px"
                  />
                </div>
              </div>

              {/* Rides List */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Available Rides</h2>
                </div>
                <div className="divide-y">
                  {rides.map((ride) => (
                    <div 
                      key={ride._id} 
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRideClick(ride._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                              {ride.driver?.image ? (
                                <img 
                                  src={ride.driver.image} 
                                  alt={ride.driver.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm">
                                  {ride.driver?.name?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">
                              {ride.driver?.name || 'Unknown Driver'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {ride.startLocation.name}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-sm font-medium text-gray-900">
                              {ride.endLocation.name}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {format(new Date(ride.departureDate), 'MMM d, yyyy')} at {ride.departureTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">
                            ₹{ride.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ride.availableSeats} seats left
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {!isSearching && rides.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">No rides found matching your criteria.</p>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Searching for rides...</span>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Ride Details Modal */}
      {showRideDetails && selectedRide && (
        <RideDetailsModal
          rideDetails={{
            id: selectedRide._id,
            driverName: selectedRide.driver?.name || 'Unknown Driver',
            driverRating: selectedRide.driver?.rating || 0,
            driverAvatar: selectedRide.driver?.image,
            origin: selectedRide.startLocation.name,
            destination: selectedRide.endLocation.name,
            departureTime: selectedRide.departureTime,
            departureDate: format(new Date(selectedRide.departureDate), 'MMM d, yyyy'),
            availableSeats: selectedRide.availableSeats,
            pricePerSeat: selectedRide.price,
            vehicleModel: selectedRide.vehicleModel,
            vehicleColor: selectedRide.vehicleColor
          }}
          isOpen={showRideDetails}
          onClose={() => setShowRideDetails(false)}
        />
      )}
    </>
  );
} 