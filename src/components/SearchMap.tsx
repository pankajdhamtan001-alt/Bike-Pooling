"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getRoute } from '@/utils/geocoding';

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
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
      Loading map...
    </div>
  )
});

interface Location {
  lat: number;
  lon: number;
  name: string;
}

interface SearchMapProps {
  startLocation?: Location | null;
  endLocation?: Location | null;
  height?: string;
}

export default function SearchMap({ 
  startLocation, 
  endLocation,
  height = '400px'
}: SearchMapProps) {
  const [markers, setMarkers] = useState<Array<{position: [number, number], popup: string}>>([]);
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [zoom, setZoom] = useState(13);
  const [routeData, setRouteData] = useState<any>(null);

  // Fetch route when both locations are available
  useEffect(() => {
    const fetchRoute = async () => {
      if (startLocation && endLocation) {
        try {
          const data = await getRoute(
            startLocation.lat,
            startLocation.lon,
            endLocation.lat,
            endLocation.lon
          );
          setRouteData(data);
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      }
    };

    fetchRoute();
  }, [startLocation, endLocation]);

  useEffect(() => {
    const newMarkers = [];
    
    // Add start location marker if provided
    if (startLocation) {
      newMarkers.push({
        position: [startLocation.lat, startLocation.lon] as [number, number],
        popup: `Start: ${startLocation.name}`
      });
    }
    
    // Add end location marker if provided
    if (endLocation) {
      newMarkers.push({
        position: [endLocation.lat, endLocation.lon] as [number, number],
        popup: `Destination: ${endLocation.name}`
      });
    }
    
    setMarkers(newMarkers);
    
    // If both locations are provided, center the map between them
    if (startLocation && endLocation) {
      const centerLat = (startLocation.lat + endLocation.lat) / 2;
      const centerLon = (startLocation.lon + endLocation.lon) / 2;
      setCenter([centerLat, centerLon]);
      
      // Calculate distance between points to determine appropriate zoom level
      const latDiff = Math.abs(startLocation.lat - endLocation.lat);
      const lonDiff = Math.abs(startLocation.lon - endLocation.lon);
      const maxDiff = Math.max(latDiff, lonDiff);
      
      // Adjust zoom level based on distance
      if (maxDiff > 5) {
        setZoom(6); // For very long distances
      } else if (maxDiff > 2) {
        setZoom(8); // For medium distances
      } else if (maxDiff > 1) {
        setZoom(10); // For shorter distances
      } else {
        setZoom(12); // For very short distances
      }
    } 
    // If only start location is provided, center on it
    else if (startLocation) {
      setCenter([startLocation.lat, startLocation.lon]);
      setZoom(13);
    } 
    // If only end location is provided, center on it
    else if (endLocation) {
      setCenter([endLocation.lat, endLocation.lon]);
      setZoom(13);
    }
  }, [startLocation, endLocation]);

  return (
    <div className="mb-6 rounded-lg overflow-hidden shadow-md">
      <MapComponent
        center={center}
        zoom={zoom}
        markers={markers}
        height={height}
        routeData={routeData}
      />
    </div>
  );
} 