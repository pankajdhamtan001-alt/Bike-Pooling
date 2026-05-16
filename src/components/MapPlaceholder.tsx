import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-solid-svg-icons';

interface MapPlaceholderProps {
  height?: string;
  message?: string;
}

export default function MapPlaceholder({ 
  height = '500px', 
  message = 'Map loading...' 
}: MapPlaceholderProps) {
  return (
    <div 
      className="bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center"
      style={{ height }}
    >
      <FontAwesomeIcon 
        icon={faMap} 
        className="text-gray-400 mb-4"
        style={{ fontSize: '3rem' }}
      />
      <p className="text-gray-600 text-lg">{message}</p>
      <p className="text-gray-500 text-sm mt-2">
        Please ensure location services are enabled
      </p>
    </div>
  );
} 