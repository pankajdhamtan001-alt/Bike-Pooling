"use client";

import { useState, useEffect } from 'react';
import { geocodeAddress } from '../../utils/geocoding';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Dynamically import the RouteMap component with no SSR
const RouteMap = dynamic(() => import('../../components/RouteMap'), {
  ssr: false,
  loading: () => (
    <div 
      className="bg-gray-100 rounded-lg h-80 flex items-center justify-center mb-6"
    >
      <p className="text-gray-500">Loading map component...</p>
    </div>
  )
});

// Dynamically import the SearchMap component with no SSR
const SearchMap = dynamic(() => import('../../components/SearchMap'), {
  ssr: false,
  loading: () => (
    <div 
      className="bg-gray-100 rounded-lg h-80 flex items-center justify-center mb-6"
    >
      <p className="text-gray-500">Loading map component...</p>
    </div>
  )
});

export default function MapDemo() {
  const [isMounted, setIsMounted] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [geocodedStart, setGeocodedStart] = useState(null);
  const [geocodedEnd, setGeocodedEnd] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = async () => {
    if (!startLocation || !endLocation) {
      setErrorMessage('Please enter both start and end locations.');
      return;
    }

    setIsGeocoding(true);
    setErrorMessage('');
    
    try {
      // Geocode the "from" location
      const fromResult = await geocodeAddress(startLocation);
      setGeocodedStart(fromResult);
      
      // Geocode the "to" location
      const toResult = await geocodeAddress(endLocation);
      setGeocodedEnd(toResult);

      if (!fromResult && !toResult) {
        setErrorMessage('Both locations could not be found. Please check the addresses.');
      } else if (!fromResult) {
        setErrorMessage('Starting location could not be found. Please check the address.');
      } else if (!toResult) {
        setErrorMessage('Destination could not be found. Please check the address.');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      setErrorMessage('Error finding locations. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  if (!isMounted) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">OpenStreetMap Integration Demo</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Plan Your Route</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter start location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter destination"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
              />
            </div>
          </div>
          
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            onClick={handleSearch}
            disabled={isGeocoding}
          >
            {isGeocoding ? 'Finding Locations...' : 'Find Route'}
          </button>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>
        
        {geocodedStart && geocodedEnd ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Route</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RouteMap
                  startLocation={geocodedStart}
                  endLocation={geocodedEnd}
                  height="300px"
                />
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium mb-2">Route Details</h3>
                  <p>From: {geocodedStart.display_name}</p>
                  <p>To: {geocodedEnd.display_name}</p>
                </div>
              </div>
              <div>
                <SearchMap height="300px" />
                <p className="mt-4 text-gray-600">
                  Interactive map view
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Maps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SearchMap height="300px" />
                <p className="mt-4 text-gray-600">
                  Start location view
                </p>
              </div>
              <div>
                <SearchMap height="300px" />
                <p className="mt-4 text-gray-600">
                  End location view
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-600">
              Enter start and destination locations above to see your route.
            </p>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">About OpenStreetMap</h2>
          <p className="mb-4">
            This application uses OpenStreetMap (OSM) for mapping, geocoding, and routing:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Maps are provided by OpenStreetMap contributors</li>
            <li>Address search is powered by Nominatim API</li>
            <li>Route calculations use the OSRM (Open Source Routing Machine)</li>
          </ul>
          <p>
            OpenStreetMap is a free, editable map of the world, created and maintained by volunteers and available for use under an open license.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
} 