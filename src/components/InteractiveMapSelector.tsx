"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { reverseGeocode } from '@/utils/geocoding';

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

interface LocationMarker {
  position: [number, number];
  display_name: string;
  isStart: boolean;
}

function LocationMarkerCreator({ 
  setStartLocation, 
  setEndLocation, 
  selectMode
}: { 
  setStartLocation: (location: any) => void, 
  setEndLocation: (location: any) => void,
  selectMode: 'start' | 'end' | null 
}) {
  const map = useMapEvents({
    click: async (e) => {
      if (!selectMode) return;
      
      const { lat, lng } = e.latlng;
      
      try {
        // Get location details from coordinates
        const result = await reverseGeocode(lat, lng);
        
        if (result) {
          const locationData = {
            lat,
            lon: lng,
            name: result.name || result.display_name.split(',')[0],
            display_name: result.display_name
          };
          
          if (selectMode === 'start') {
            setStartLocation(locationData);
          } else {
            setEndLocation(locationData);
          }
          
          map.flyTo([lat, lng], map.getZoom());
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    }
  });
  
  return null;
}

interface InteractiveMapSelectorProps {
  startLocation: any | null;
  endLocation: any | null;
  onStartLocationChange: (location: any) => void;
  onEndLocationChange: (location: any) => void;
  height?: string;
}

export default function InteractiveMapSelector({
  startLocation,
  endLocation,
  onStartLocationChange,
  onEndLocationChange,
  height = '500px'
}: InteractiveMapSelectorProps) {
  const [markers, setMarkers] = useState<LocationMarker[]>([]);
  const [selectMode, setSelectMode] = useState<'start' | 'end' | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Inject CSS to ensure map popups have a lower z-index
  useEffect(() => {
    if (typeof window !== 'undefined' && mapLoaded) {
      const styleEl = document.createElement('style');
      styleEl.id = 'map-selector-popup-fix';
      styleEl.innerHTML = `
        .leaflet-popup {
          z-index: 900 !important;
        }
      `;
      
      if (!document.getElementById('map-selector-popup-fix')) {
        document.head.appendChild(styleEl);
      }
      
      return () => {
        const existingStyle = document.getElementById('map-selector-popup-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [mapLoaded]);

  // Update markers when locations change
  useEffect(() => {
    const newMarkers: LocationMarker[] = [];
    
    if (startLocation) {
      newMarkers.push({
        position: [startLocation.lat, startLocation.lon],
        display_name: startLocation.display_name || startLocation.name,
        isStart: true
      });
    }
    
    if (endLocation) {
      newMarkers.push({
        position: [endLocation.lat, endLocation.lon],
        display_name: endLocation.display_name || endLocation.name,
        isStart: false
      });
    }
    
    setMarkers(newMarkers);
  }, [startLocation, endLocation]);
  
  // Close all popups when switching selection mode
  useEffect(() => {
    if (typeof window !== 'undefined' && mapLoaded) {
      try {
        document.querySelectorAll('.leaflet-popup-close-button').forEach(button => {
          (button as HTMLElement).click();
        });
      } catch (error) {
        console.error('Error closing popups:', error);
      }
    }
  }, [selectMode, mapLoaded]);
  
  const handleStartClick = () => {
    setSelectMode('start');
  };
  
  const handleEndClick = () => {
    setSelectMode('end');
  };
  
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-[400] bg-white p-2 rounded-md shadow-md flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md ${
            selectMode === 'start'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={handleStartClick}
        >
          Select Start
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            selectMode === 'end'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={handleEndClick}
        >
          Select Destination
        </button>
      </div>
      
      <div className="mt-2 text-sm text-gray-600 mb-1">
        {selectMode === 'start' && '👆 Click on the map to set your start location'}
        {selectMode === 'end' && '👆 Click on the map to set your destination'}
        {!selectMode && 'Select a point type, then click on the map to set the location'}
      </div>
      
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height, width: '100%' }}
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarkerCreator 
          setStartLocation={onStartLocationChange}
          setEndLocation={onEndLocationChange}
          selectMode={selectMode}
        />
        
        {markers.map((marker, idx) => (
          <Marker 
            key={`${marker.position[0]}-${marker.position[1]}-${idx}`}
            position={marker.position}
            icon={marker.isStart ? StartIcon : EndIcon}
          >
            <Popup 
              closeButton={true}
              autoClose={true}
              closeOnClick={true}
            >
              <div className="max-w-xs">
                <strong>{marker.isStart ? 'Start' : 'Destination'}</strong>
                <p className="text-sm line-clamp-2">{marker.display_name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 