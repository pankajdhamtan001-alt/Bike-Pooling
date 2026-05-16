"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js with SVG-based icons
const DefaultIcon = L.divIcon({
  className: "custom-icon",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#3B82F6">
    <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 12 24 12 24C12 24 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

interface MapComponentProps {
  center?: [number, number]; // [latitude, longitude]
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
  height?: string;
  routeData?: any;
}

// Component to fit bounds when route changes
function FitBounds({ routeData, markers }: { routeData: any, markers: Array<{position: [number, number]}> }) {
  const map = useMap();
  
  useEffect(() => {
    if (!routeData || !routeData.routes || routeData.routes.length === 0) return;
    
    try {
      // Create an array of all points from the route and markers
      const allPoints: [number, number][] = [];
      
      // Add route coordinates
      const routeCoords = routeData.routes[0].geometry.coordinates;
      routeCoords.forEach((coord: [number, number]) => {
        allPoints.push([coord[1], coord[0]]); // Swap lon/lat to lat/lon
      });
      
      // Add marker positions
      markers.forEach(marker => {
        allPoints.push(marker.position);
      });
      
      // Create bounds from all points
      if (allPoints.length > 0) {
        const bounds = allPoints.reduce((bounds: L.LatLngBounds, point) => {
          return bounds.extend(point);
        }, L.latLngBounds(allPoints[0], allPoints[0]));
        
        // Add padding to the bounds
        map.fitBounds(bounds, { 
          padding: [50, 50],
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [map, routeData, markers]);
  
  return null;
}

export default function MapComponent({ 
  center = [51.505, -0.09], // Default to London
  zoom = 13,
  markers = [],
  height = '400px',
  routeData = null
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Workaround for leaflet marker icons
    // Fix icon issues by using our DefaultIcon instead of modifying prototype
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  if (!isMounted) {
    // SSR workaround
    return (
      <div 
        style={{ 
          height,
          backgroundColor: '#f0f0f0',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        Loading map...
      </div>
    );
  }

  // Extract route coordinates from routeData
  let routeCoordinates: Array<[number, number]> = [];
  if (routeData && routeData.routes && routeData.routes.length > 0) {
    // OSRM returns coordinates as [longitude, latitude] in the GeoJSON format
    // But Leaflet needs [latitude, longitude], so we need to swap them
    routeCoordinates = routeData.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height, width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          {marker.popup && (
            <Popup>
              {marker.popup}
            </Popup>
          )}
        </Marker>
      ))}

      {routeCoordinates.length > 0 && (
        <Polyline 
          positions={routeCoordinates}
          color="#3B82F6"
          weight={5}
          opacity={0.7}
        />
      )}

      {routeData && <FitBounds routeData={routeData} markers={markers} />}
    </MapContainer>
  );
} 