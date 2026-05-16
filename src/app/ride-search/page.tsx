"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMapMarkerAlt, faCalendarAlt, faClock, faBicycle, faUsers, faStar, faMoneyBillWave, faLocationDot, faRoute } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { geocodeAddress } from '../../utils/geocoding';

// Dynamically import the SearchMap component with no SSR
const SearchMap = dynamic(() => import('../../components/SearchMap'), {
  ssr: false,
  loading: () => (
    <div 
      className="bg-gray-100 rounded-lg h-80 flex items-center justify-center mb-6"
    >
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
});

export default function RideSearch() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedFrom, setGeocodedFrom] = useState(null);
  const [geocodedTo, setGeocodedTo] = useState(null);
  const [mapError, setMapError] = useState('');

  // Mock data for available rides
  const [rides, setRides] = useState([
    {
      id: 1,
      from: "Downtown",
      to: "University Campus",
      date: "2025-03-15",
      time: "08:30",
      price: 5.50,
      rating: 4.8,
      seats: 2,
      driver: {
        name: "Alex Johnson",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.9,
        rides: 120
      }
    },
    {
      id: 2,
      from: "Riverside Park",
      to: "City Center",
      date: "2025-03-15",
      time: "09:15",
      price: 4.75,
      rating: 4.6,
      seats: 1,
      driver: {
        name: "Sarah Miller",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 4.7,
        rides: 85
      }
    },
    {
      id: 3,
      from: "Oakwood Heights",
      to: "Tech District",
      date: "2025-03-15",
      time: "10:00",
      price: 6.25,
      rating: 4.9,
      seats: 3,
      driver: {
        name: "Michael Chen",
        image: "https://randomuser.me/api/portraits/men/67.jpg", 
        rating: 5.0,
        rides: 210
      }
    }
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle geocoding of addresses
  const handleSearch = async () => {
    setIsGeocoding(true);
    setMapError('');
    
    try {
      // Geocode the "from" location
      const fromResult = await geocodeAddress(fromLocation);
      setGeocodedFrom(fromResult);
      
      // Geocode the "to" location
      const toResult = await geocodeAddress(toLocation);
      setGeocodedTo(toResult);

      if (!fromResult && !toResult) {
        setMapError('Both locations could not be found. Please check the addresses.');
      } else if (!fromResult) {
        setMapError('Starting location could not be found. Please check the address.');
      } else if (!toResult) {
        setMapError('Destination could not be found. Please check the address.');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      setMapError('Error finding locations. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  if (!isMounted) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Available Rides</h1>
            
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="form-group">
                <label className="block text-gray-700 mb-2" htmlFor="start-location">From</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                  <input 
                    id="start-location"
                    type="text" 
                    placeholder="Starting point" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="block text-gray-700 mb-2" htmlFor="destination">To</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                  <input 
                    id="destination"
                    type="text" 
                    placeholder="Destination" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="block text-gray-700 mb-2" htmlFor="ride-date">Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </span>
                  <input 
                    id="ride-date"
                    type="date" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Select ride date"
                    title="Select ride date"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="block text-gray-700 mb-2" htmlFor="ride-time">Time</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FontAwesomeIcon icon={faClock} />
                  </span>
                  <input 
                    id="ride-time"
                    type="time" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Select ride time"
                    title="Select ride time"
                  />
                </div>
              </div>
            
              <div className="flex items-center justify-between mt-6 md:col-span-4">
                <button 
                  type="button"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FontAwesomeIcon icon={faFilter} />
                  <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isGeocoding}
                >
                  {isGeocoding ? 'Searching...' : 'Search Rides'}
                </button>
              </div>
            </form>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="form-group">
                  <label className="block text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Minimum price"
                      id="min-price"
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Maximum price"
                      id="max-price"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 mb-2" htmlFor="min-rating">Minimum Rating</label>
                  <select 
                    id="min-rating"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Select minimum rating"
                    title="Select minimum rating"
                  >
                    <option value="">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="block text-gray-700 mb-2" htmlFor="min-seats">Available Seats</label>
                  <select 
                    id="min-seats"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Select minimum available seats"
                    title="Select minimum available seats"
                  >
                    <option value="1">1+ Seat</option>
                    <option value="2">2+ Seats</option>
                    <option value="3">3+ Seats</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Map section */}
          {(geocodedFrom || geocodedTo) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faRoute} className="mr-2 text-primary" />
                Route Map
              </h2>
              <SearchMap 
                startLocation={geocodedFrom} 
                endLocation={geocodedTo}
                height="400px"
              />
              {mapError && (
                <div className="text-red-500 mt-2">{mapError}</div>
              )}
            </div>
          )}
          
          <h2 className="text-xl font-bold text-gray-800 mb-4">Available Rides</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map(ride => (
              <div key={ride.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{ride.from} to {ride.to}</h3>
                      <div className="flex items-center gap-4 text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                          {ride.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} className="text-primary" />
                          {ride.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary text-xl">${ride.price}</div>
                      <div className="text-sm text-gray-500">per seat</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={ride.driver.image} 
                        alt={ride.driver.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{ride.driver.name}</div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                          <span>{ride.driver.rating} ({ride.driver.rides} rides)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                      <span>{ride.seats} seat{ride.seats !== 1 ? 's' : ''} left</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                    Book Ride
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 