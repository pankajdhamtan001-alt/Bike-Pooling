"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getRoute } from '../utils/geocoding';

// Dynamically import the MapComponent to prevent SSR issues
const MapWithRoute = dynamic(() => import('./MapWithRoute'), {
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        height: '400px',
        backgroundColor: '#f0f0f0',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      Loading route map...
    </div>
  )
});

interface Location {
  lat: number;
  lon: number;
  name: string;
}

interface RouteMapProps {
  startLocation: Location | [number, number];
  endLocation: Location | [number, number];
  routeData?: any;
  height?: string;
}

export default function RouteMap({ 
  startLocation, 
  endLocation,
  routeData: initialRouteData = null,
  height = '400px'
}: RouteMapProps) {
  const [routeData, setRouteData] = useState<any>(initialRouteData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract coordinates based on input type
  const startCoords = Array.isArray(startLocation) 
    ? { lat: startLocation[0], lon: startLocation[1], name: "Start" }
    : startLocation;
    
  const endCoords = Array.isArray(endLocation)
    ? { lat: endLocation[0], lon: endLocation[1], name: "Destination" }
    : endLocation;

  useEffect(() => {
    const fetchRoute = async () => {
      // If route data is already provided, use it
      if (initialRouteData) {
        setRouteData(initialRouteData);
        return;
      }
      
      if (startCoords?.lat && startCoords?.lon && endCoords?.lat && endCoords?.lon) {
        setIsLoading(true);
        setError('');
        
        try {
          const data = await getRoute(
            startCoords.lat,
            startCoords.lon,
            endCoords.lat,
            endCoords.lon
          );
          
          if (data && data.routes && data.routes.length > 0) {
            setRouteData(data);
          } else {
            setError('Could not find a route between these locations.');
          }
        } catch (err) {
          console.error('Error fetching route:', err);
          setError('Failed to load route data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRoute();
  }, [startCoords, endCoords, initialRouteData]);

  const markers = [
    {
      position: [startCoords.lat, startCoords.lon] as [number, number],
      popup: `Start: ${startCoords.name}`,
      isStart: true
    },
    {
      position: [endCoords.lat, endCoords.lon] as [number, number],
      popup: `Destination: ${endCoords.name}`,
      isStart: false
    }
  ];

  // Calculate center point between start and end
  const centerLat = (startCoords.lat + endCoords.lat) / 2;
  const centerLon = (startCoords.lon + endCoords.lon) / 2;

  return (
    <div className="relative mb-6 rounded-lg overflow-hidden shadow-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <MapWithRoute
        center={[centerLat, centerLon]}
        zoom={10}
        markers={markers}
        routeData={routeData}
        height={height}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="text-gray-700">Loading route data...</div>
        </div>
      )}
    </div>
  );
} 