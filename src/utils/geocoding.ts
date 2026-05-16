interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
}

/**
 * Geocode an address using OpenStreetMap's Nominatim API
 * @param address The address to geocode
 * @returns Promise with geocoding result containing lat, lon, and display name
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address.trim()) return null;
  
  try {
    // Use Nominatim API with required headers and parameters
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'CarPoolApp/1.0',
          'Accept-Language': 'en', // Ensure English results
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        name: result.name || address,
        display_name: result.display_name
      };
    }
    
    return null; // No results found
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
 * @param lat Latitude
 * @param lon Longitude
 * @returns Promise with geocoding result containing address details
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
  try {
    // Use Nominatim API with required headers and parameters for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CarPoolApp/1.0',
          'Accept-Language': 'en', // Ensure English results
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result) {
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        name: result.name || result.display_name.split(',')[0],
        display_name: result.display_name
      };
    }
    
    return null; // No results found
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
}

/**
 * Get a route between two locations using OSRM API
 * @param startLat Start location latitude
 * @param startLon Start location longitude
 * @param endLat End location latitude
 * @param endLon End location longitude
 * @returns Promise with route information
 */
export async function getRoute(
  startLat: number, 
  startLon: number, 
  endLat: number, 
  endLon: number
) {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`,
      {
        headers: {
          'User-Agent': 'CarPoolApp/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Routing error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Routing failed:', error);
    return null;
  }
} 