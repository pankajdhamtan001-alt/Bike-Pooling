"use client";

import { useState, useEffect, useRef } from 'react';
import { geocodeAddress } from '../utils/geocoding';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface SuggestionResult {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
}

interface LocationAutocompleteProps {
  label: string;
  placeholder?: string;
  onChangeAction: (location: { lat: number; lon: number; name: string; display_name: string } | null) => void;
  value?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  isStart?: boolean;
}

export default function LocationAutocomplete({
  label,
  placeholder = "Enter location",
  onChangeAction,
  value = "",
  className = "",
  required = false,
  disabled = false,
  isStart = false,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.trim().length > 2) {
        setIsLoading(true);
        setSuggestions([]);
        
        try {
          // Use the Nominatim API to get location suggestions
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&limit=5`,
            {
              headers: {
                'User-Agent': 'CarPoolApp/1.0',
                'Accept-Language': 'en',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch suggestions: ${response.status}`);
          }

          const data = await response.json();
          
          // Map the response to our format
          const formattedSuggestions: SuggestionResult[] = data.map((item: any) => ({
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            name: item.name || item.display_name.split(',')[0],
            display_name: item.display_name
          }));
          
          setSuggestions(formattedSuggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SuggestionResult) => {
    setInputValue(suggestion.display_name);
    onChangeAction(suggestion);
    setSuggestions([]);
    setIsFocused(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (!newValue.trim()) {
      onChangeAction(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          <FontAwesomeIcon icon={faLocationDot} />
        </span>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={`w-full p-2.5 pl-10 text-gray-900 border border-gray-300 rounded-lg 
                     ${isStart ? 'bg-green-50' : 'bg-red-50'} 
                     focus:ring-blue-500 focus:border-blue-500`}
          disabled={disabled}
          required={required}
        />
        
        {isLoading && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          </span>
        )}
      </div>
      
      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-72 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.lat}-${suggestion.lon}-${index}`}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.name}</div>
              <div className="text-sm text-gray-500 truncate">{suggestion.display_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 