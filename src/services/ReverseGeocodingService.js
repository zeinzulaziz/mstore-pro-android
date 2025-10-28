/**
 * Reverse Geocoding Service
 * Converts coordinates to real address using OpenStreetMap Nominatim API
 */

class ReverseGeocodingService {
  static async getAddressFromCoordinates(latitude, longitude) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=id&email=support@doseofbeauty.id`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'DoseOfBeautyApp/1.0 (contact: support@doseofbeauty.id)',
          'Referer': 'https://doseofbeauty.id'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.address) {
        throw new Error('No address data found');
      }
      
      // Extract address components
      const address = data.address;
      
      return {
        fullAddress: data.display_name,
        city: address.city || address.town || address.village || address.municipality || 'Unknown',
        district: address.suburb || address.district || address.county || 'Unknown',
        province: address.state || address.province || 'Unknown',
        postcode: address.postcode || 'Unknown',
        country: address.country || 'Indonesia',
        formattedAddress: this.formatAddress(address)
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        fullAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        city: 'Unknown',
        district: 'Unknown',
        province: 'Unknown',
        postcode: 'Unknown',
        country: 'Indonesia',
        formattedAddress: 'Alamat tidak dapat ditemukan',
        error: error.message
      };
    }
  }

  static formatAddress(address) {
    const parts = [];
    
    // Add street address
    if (address.house_number && address.road) {
      parts.push(`${address.road} No. ${address.house_number}`);
    } else if (address.road) {
      parts.push(address.road);
    }
    
    // Add district/suburb
    if (address.suburb) {
      parts.push(address.suburb);
    } else if (address.district) {
      parts.push(address.district);
    }
    
    // Add city
    if (address.city) {
      parts.push(address.city);
    } else if (address.town) {
      parts.push(address.town);
    } else if (address.village) {
      parts.push(address.village);
    }
    
    // Add province
    if (address.state) {
      parts.push(address.state);
    }
    
    // Add postcode
    if (address.postcode) {
      parts.push(address.postcode);
    }
    
    // Add country
    if (address.country) {
      parts.push(address.country);
    }
    
    return parts.join(', ');
  }

  static async getAddressWithFallback(latitude, longitude) {
    try {
      // Try OpenStreetMap first
      const address = await this.getAddressFromCoordinates(latitude, longitude);
      
      // If we got a good result, return it
      if (address.city !== 'Unknown' && address.district !== 'Unknown') {
        return address;
      }
      
      // Fallback: try with different zoom level
      const fallbackAddress = await this.getAddressFromCoordinates(latitude, longitude);
      return fallbackAddress;
      
    } catch (error) {
      console.error('All reverse geocoding attempts failed:', error);
      return {
        fullAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        city: 'Unknown',
        district: 'Unknown',
        province: 'Unknown',
        postcode: 'Unknown',
        country: 'Indonesia',
        formattedAddress: 'Alamat tidak dapat ditemukan',
        error: error.message
      };
    }
  }
}

export default ReverseGeocodingService;
