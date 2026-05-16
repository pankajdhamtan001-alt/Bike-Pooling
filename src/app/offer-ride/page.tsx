"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faClock, 
  faUser, 
  faCar, 
  faInfoCircle,
  faArrowRight,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
import LocationAutocomplete from '../../components/LocationAutocomplete';
import { getRoute } from '../../utils/geocoding';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Dynamically import the map components with no SSR
const RouteMap = dynamic(() => import('../../components/RouteMap'), { ssr: false });
const InteractiveMapSelector = dynamic(() => import('../../components/InteractiveMapSelector'), { ssr: false });

interface Location {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
}

export default function OfferRidePage() {
  // Form state
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState('');
  const [carModel, setCarModel] = useState('');
  const [description, setDescription] = useState('');
  
  // UI state
  const [activeTab, setActiveTab] = useState<'form' | 'map'>('form');
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  
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
    
    if (!date || !time) {
      alert('Please select both date and time for departure');
      return;
    }
    
    if (!carModel) {
      alert('Please enter your car model');
      return;
    }
    
    if (!routeData || !routeData.routes || routeData.routes.length === 0) {
      alert('Unable to calculate route. Please try different locations');
      return;
    }
    
    try {
      // Format the data according to the Ride model's schema
      const rideData = {
        startLocation: {
          lat: startLocation.lat,
          lon: startLocation.lon,
          name: startLocation.name,
          display_name: startLocation.display_name
        },
        endLocation: {
          lat: endLocation.lat,
          lon: endLocation.lon,
          name: endLocation.name,
          display_name: endLocation.display_name
        },
        route: {
          type: 'LineString',
          coordinates: routeData.routes[0].geometry.coordinates,
          distance: routeData.routes[0].distance,
          duration: routeData.routes[0].duration
        },
        departureDate: date,
        departureTime: time,
        availableSeats: seats,
        price: parseFloat(price),
        carModel: carModel,
        description: description
      };
      
      console.log('Submitting ride offer:', rideData);
      
      // Send the data to the API
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rideData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ride');
      }
      
      const result = await response.json();
      alert('Ride offered successfully!');
      
      // Clear form after successful submission
      setStartLocation(null);
      setEndLocation(null);
      setDate('');
      setTime('');
      setSeats(1);
      setPrice('');
      setCarModel('');
      setDescription('');
      setRouteData(null);
      setDistance(null);
      setDuration(null);
      
    } catch (error) {
      console.error('Error offering ride:', error);
      alert(`Failed to offer ride: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Offer a Ride</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-4 font-medium text-center ${
                  activeTab === 'form'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Switch to ride details form"
                title="Switch to ride details form"
              >
                <FontAwesomeIcon icon={faCar} className="mr-2" />
                Ride Details
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 py-4 font-medium text-center ${
                  activeTab === 'map'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Switch to map selection"
                title="Switch to map selection"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Select on Map
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'form' ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl font-semibold">Route Information</h2>
                        {(startLocation && endLocation) && (
                          <div className="ml-auto flex items-center text-sm text-gray-600">
                            {distance && (
                              <span className="mr-4">
                                <span className="font-semibold">Distance:</span> {formatDistance(distance)}
                              </span>
                            )}
                            {duration && (
                              <span>
                                <span className="font-semibold">Duration:</span> {formatDuration(duration)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <LocationAutocomplete
                          label="Start Location"
                          placeholder="Enter starting point"
                          onChangeAction={setStartLocation}
                          required
                          isStart
                        />
                        
                        <LocationAutocomplete
                          label="Destination"
                          placeholder="Enter destination"
                          onChangeAction={setEndLocation}
                          required
                        />
                      </div>
                      
                      {(startLocation && endLocation) ? (
                        <div className="mb-6">
                          <RouteMap
                            startLocation={startLocation}
                            endLocation={endLocation}
                            height="300px"
                          />
                        </div>
                      ) : (
                        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
                          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-2" />
                          Enter both locations to see the route map
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </span>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full p-2.5 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          min={new Date().toISOString().split('T')[0]}
                          required
                          title="Select departure date"
                          aria-label="Departure date"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FontAwesomeIcon icon={faClock} />
                        </span>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full p-2.5 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                          title="Select departure time"
                          aria-label="Departure time"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Seats <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                        <select
                          value={seats}
                          onChange={(e) => setSeats(parseInt(e.target.value))}
                          className="w-full p-2.5 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                          title="Select number of available seats"
                          aria-label="Number of available seats"
                        >
                          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'seat' : 'seats'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Seat <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FontAwesomeIcon icon={faMoneyBillWave} />
                        </span>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full p-2.5 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                          title="Enter price per seat"
                          aria-label="Price per seat"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Car Model <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FontAwesomeIcon icon={faCar} />
                        </span>
                        <input
                          type="text"
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          className="w-full p-2.5 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Toyota Camry"
                          required
                          title="Enter your car model"
                          aria-label="Car model"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any additional details about your ride (luggage space, pet friendly, etc.)"
                        title="Additional ride information"
                        aria-label="Additional ride information"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      disabled={!startLocation || !endLocation}
                    >
                      Offer Ride
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Use the interactive map to select your starting point and destination.
                    Click the buttons below to select a location, then click on the map.
                  </p>
                  
                  <InteractiveMapSelector
                    startLocation={startLocation}
                    endLocation={endLocation}
                    onStartLocationChange={setStartLocation}
                    onEndLocationChange={setEndLocation}
                    height="500px"
                  />
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      {startLocation && endLocation && (
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">Route Details:</p>
                          <p className="text-gray-600">
                            <span className="font-medium">From:</span> {startLocation.display_name}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">To:</span> {endLocation.display_name}
                          </p>
                          {distance && duration && (
                            <p className="text-gray-600">
                              <span className="font-medium">Distance:</span> {formatDistance(distance)} • 
                              <span className="font-medium ml-2">Duration:</span> {formatDuration(duration)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('form')}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center"
                      disabled={!startLocation || !endLocation}
                    >
                      Continue
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </button>
                  </div>
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