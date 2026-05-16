"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create custom SVG marker icons to avoid external image dependencies
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="${color}">
      <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 12 24 12 24C12 24 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
    </svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const StartIcon = createCustomIcon("#4CAF50"); // Green for start
const EndIcon = createCustomIcon("#F44336");   // Red for end

interface RouteData {
  routes?: Array<{
    geometry: {
      coordinates: Array<[number, number]>;
    };
  }>;
}

// Helper component to fit bounds when route changes
function FitBounds({ routeData }: { routeData: RouteData }) {
  const map = useMap();
  
  useEffect(() => {
    if (routeData && routeData.routes && routeData.routes.length > 0) {
      const coords = routeData.routes[0].geometry.coordinates;
      
      if (coords && coords.length > 0) {
        // Create bounds from all points
        const bounds = coords.reduce((bounds: L.LatLngBounds, coord: [number, number]) => {
          // In GeoJSON, coordinates are [longitude, latitude]
          return bounds.extend([coord[1], coord[0]]);
        }, L.latLngBounds([coords[0][1], coords[0][0]], [coords[0][1], coords[0][0]]));
        
        // Add some padding and animate the transition
        map.fitBounds(bounds, { 
          padding: [50, 50],
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    }
  }, [map, routeData]);
  
  return null;
}

interface MapWithRouteProps {
  center: [number, number];
  zoom: number;
  markers: Array<{
    position: [number, number];
    popup?: string;
    isStart?: boolean;
  }>;
  routeData: RouteData | null;
  height?: string;
}

export default function MapWithRoute({ 
  center = [51.505, -0.09],
  zoom = 13,
  markers = [],
  routeData = null,
  height = '400px'
}: MapWithRouteProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  // Add some styling to make OSM maps nicer
  const mapStyle = {
    height,
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={mapStyle}
      zoomAnimation={true}
      markerZoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker, index) => (
        <Marker 
          key={index} 
          position={marker.position}
          icon={index === 0 ? StartIcon : EndIcon}
        >
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
          animate={true}
          duration={1000}
        />
      )}
      
      {routeData && <FitBounds routeData={routeData} />}
    </MapContainer>
  );
} 