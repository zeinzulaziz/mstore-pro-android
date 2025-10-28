/**
 * Location Cache Service
 * Handles caching of location data (coordinates + address details)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'cached_location_data';

class LocationCacheService {
  
  /**
   * Cache location data with coordinates and address details
   * @param {Object} locationData - Location data to cache
   * @param {number} locationData.latitude - Latitude coordinate
   * @param {number} locationData.longitude - Longitude coordinate
   * @param {Object} locationData.address - Address details
   * @param {string} locationData.address.city - City name
   * @param {string} locationData.address.district - District name
   * @param {string} locationData.address.province - Province name
   * @param {string} locationData.address.postcode - Postal code
   * @param {string} locationData.address.formattedAddress - Full formatted address
   * @param {number} locationData.timestamp - Cache timestamp
   */
  static async cacheLocationData(dispatch, locationData) {
    try {
      const cacheData = {
        ...locationData,
        timestamp: Date.now(),
        cached: true
      };
      
      console.log('🗄️ Caching location data:', JSON.stringify(cacheData, null, 2));
      
      // Store directly in AsyncStorage
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      
      console.log('✅ Location data cached successfully in AsyncStorage');
      
      return {
        success: true,
        message: 'Location data cached successfully'
      };
    } catch (error) {
      console.error('❌ Error caching location data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get cached location data from AsyncStorage
   * @returns {Object|null} Cached location data or null
   */
  static async getCachedLocation() {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      
      if (!cachedData) {
        console.log('📭 No cached location found in AsyncStorage');
        return null;
      }
      
      const cachedLocation = JSON.parse(cachedData);
      
      // Check if cache is still valid (24 hours)
      const cacheAge = Date.now() - cachedLocation.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (cacheAge > maxAge) {
        console.log('⏰ Cached location expired, age:', Math.round(cacheAge / (60 * 60 * 1000)), 'hours');
        // Clear expired cache
        await AsyncStorage.removeItem(CACHE_KEY);
        return null;
      }
      
      console.log('✅ Using cached location data from AsyncStorage:', JSON.stringify(cachedLocation, null, 2));
      return cachedLocation;
    } catch (error) {
      console.error('❌ Error getting cached location:', error);
      return null;
    }
  }
  
  /**
   * Clear cached location data
   */
  static async clearCachedLocation() {
    try {
      console.log('🗑️ Clearing cached location data from AsyncStorage');
      await AsyncStorage.removeItem(CACHE_KEY);
      
      return {
        success: true,
        message: 'Cached location data cleared'
      };
    } catch (error) {
      console.error('❌ Error clearing cached location:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Check if location data is cached and valid
   * @returns {boolean} True if valid cached location exists
   */
  static async hasValidCachedLocation() {
    const cachedLocation = await this.getCachedLocation();
    return cachedLocation !== null;
  }
  
  /**
   * Get cache info (age, validity, etc.)
   * @returns {Object} Cache information
   */
  static async getCacheInfo() {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      
      if (!cachedData) {
        return {
          exists: false,
          age: null,
          valid: false
        };
      }
      
      const cachedLocation = JSON.parse(cachedData);
      const age = Date.now() - cachedLocation.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const valid = age <= maxAge;
      
      return {
        exists: true,
        age: Math.round(age / (60 * 60 * 1000)), // Age in hours
        valid: valid,
        coordinates: {
          latitude: cachedLocation.latitude,
          longitude: cachedLocation.longitude
        },
        address: cachedLocation.address
      };
    } catch (error) {
      console.error('❌ Error getting cache info:', error);
      return {
        exists: false,
        age: null,
        valid: false
      };
    }
  }
}

export default LocationCacheService;
