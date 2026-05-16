"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { format } from 'date-fns';

// Custom markers for start and end locations
const StartIcon = L.divIcon({
  className: "custom-icon",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#4CAF50">
    <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 12 24 12 24C12 24 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

const EndIcon = L.divIcon({
  className: "custom-icon",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#F44336">
    <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 12 24 12 24C12 24 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

// Component to fit map bounds to markers
function MapBoundsUpdater({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [map, bounds]);
  
  return null;
}

interface RideRouteMapProps {
  rides: any[]; // Array of ride objects
  height?: string;
  onRideClick?: (rideId: string) => void;
}

export default function RideRouteMap({
  rides = [],
  height = '300px',
  onRideClick
}: RideRouteMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Set up the map bounds based on all markers
  useEffect(() => {
    if (rides.length === 0) return;
    
    try {
      // Create an array of all points from all rides
      const allPoints: [number, number][] = [];
      
      rides.forEach(ride => {
        // Add start and end points
        if (ride.startLocation && ride.endLocation) {
          allPoints.push([ride.startLocation.lat, ride.startLocation.lon]);
          allPoints.push([ride.endLocation.lat, ride.endLocation.lon]);
          
          // Add route points if available
          if (ride.route && ride.route.coordinates) {
            ride.route.coordinates.forEach((coord: [number, number]) => {
              // Route coordinates are [lon, lat] but we need [lat, lon]
              allPoints.push([coord[1], coord[0]]);
            });
          }
        }
      });
      
      // Create bounds from all points
      if (allPoints.length > 0) {
        setMapBounds(L.latLngBounds(allPoints.map(p => L.latLng(p[0], p[1]))));
      }
    } catch (error) {
      console.error('Error setting map bounds:', error);
      setMapError('Error loading map coordinates');
    }
  }, [rides]);
  
  // Handle SSR
  useEffect(() => {
    try {
      setIsMounted(true);
    } catch (error) {
      console.error('Error mounting map:', error);
      setMapError('Failed to initialize map');
    }
  }, []);
  
  // Inject CSS to ensure map popups don't overlap with modal
  useEffect(() => {
    // Add custom CSS to ensure map popups have a lower z-index
    if (isMounted) {
      const styleEl = document.createElement('style');
      styleEl.id = 'ride-map-popup-fix';
      styleEl.innerHTML = `
        .leaflet-popup {
          z-index: 900 !important;
        }
        .leaflet-popup-content-wrapper {
          max-width: 250px;
        }
      `;
      
      if (!document.getElementById('ride-map-popup-fix')) {
        document.head.appendChild(styleEl);
      }
      
      return () => {
        const existingStyle = document.getElementById('ride-map-popup-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isMounted]);
  
  if (mapError) {
    return (
      <div 
        style={{ 
          height, 
          backgroundColor: '#f8f9fa',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}
      >
        <p className="text-red-500">{mapError}</p>
      </div>
    );
  }
  
  if (!isMounted) {
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
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }
  
  // Default center if no rides
  const defaultCenter: [number, number] = [51.505, -0.09]; // Default to London
  
  // Generate a unique color for each ride
  const getRouteColor = (index: number) => {
    const colors = ['#3388ff', '#ff5733', '#33ff57', '#5733ff', '#ff33a8', '#33a8ff'];
    return colors[index % colors.length];
  };
  
  const preventMapClick = (e: any) => {
    e.originalEvent.stopPropagation();
    e.originalEvent.preventDefault();
  };
  
  // Function to handle clicking view details
  const handleViewDetails = (e: React.MouseEvent, rideId: string) => {
    e.stopPropagation();
    
    // Close popup programmatically before opening the modal
    try {
      const target = e.target as HTMLElement;
      const popupElement = target.closest('.leaflet-popup');
      if (popupElement) {
        const closeButton = popupElement.querySelector('.leaflet-popup-close-button') as HTMLElement;
        if (closeButton) closeButton.click();
      }
      
      // Close all other popups too
      document.querySelectorAll('.leaflet-popup-close-button').forEach(button => {
        (button as HTMLElement).click();
      });
    } catch (err) {
      console.error('Error closing popup:', err);
    }
    
    // Slight delay before opening modal to ensure popups are closed
    setTimeout(() => {
      onRideClick && onRideClick(rideId);
    }, 50);
  };
  
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <MapContainer 
        center={defaultCenter} 
        zoom={10} 
        style={{ height, width: '100%' }}
        zoomAnimation={true}
        markerZoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapBounds && <MapBoundsUpdater bounds={mapBounds} />}
        
        {rides.map((ride, rideIndex) => (
          <div key={ride._id}>
            {/* Display route polyline if route coordinates exist */}
            {ride.route && ride.route.coordinates && ride.route.coordinates.length > 0 && (
              <Polyline
                positions={ride.route.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])}
                color={getRouteColor(rideIndex)}
                weight={3}
                opacity={0.6}
                eventHandlers={{
                  click: () => onRideClick && onRideClick(ride._id)
                }}
              />
            )}
            
            {/* Start location marker */}
            <Marker 
              position={[ride.startLocation.lat, ride.startLocation.lon]}
              icon={StartIcon}
              eventHandlers={{
                click: (e) => {
                  e.target.openPopup();
                }
              }}
            >
              <Popup 
                closeButton={true} 
                autoClose={true}
                closeOnClick={true}
                closeOnEscapeKey={true}
                className="compact-popup"
              >
                <div className="font-sans" onClick={preventMapClick}>
                  <p className="font-semibold text-green-600 text-sm">Start: {ride.startLocation.name}</p>
                  <p className="text-xs text-gray-700">{ride.startLocation.display_name}</p>
                  <p className="text-xs mt-1">
                    <span className="font-medium">Departure:</span> {' '}
                    {format(new Date(ride.departureDate), 'MMM d, yyyy')} at {ride.departureTime}
                  </p>
                  <button 
                    className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 w-full"
                    onClick={(e) => handleViewDetails(e, ride._id)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
            
            {/* End location marker */}
            <Marker 
              position={[ride.endLocation.lat, ride.endLocation.lon]}
              icon={EndIcon}
              eventHandlers={{
                click: (e) => {
                  e.target.openPopup();
                }
              }}
            >
              <Popup 
                closeButton={true} 
                autoClose={true}
                closeOnClick={true}
                closeOnEscapeKey={true}
                className="compact-popup"
              >
                <div className="font-sans" onClick={preventMapClick}>
                  <p className="font-semibold text-red-600 text-sm">Destination: {ride.endLocation.name}</p>
                  <p className="text-xs text-gray-700">{ride.endLocation.display_name}</p>
                  <p className="text-xs mt-1">
                    <span className="font-medium">Price:</span> ₹{ride.price}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium">Available seats:</span> {ride.availableSeats}
                  </p>
                  <button 
                    className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 w-full"
                    onClick={(e) => handleViewDetails(e, ride._id)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
} 