/**
 * Cache Manager Utility
 * Handles cache invalidation and refresh strategies
 */

import { clearImageCache, getForceRefreshImageUrl } from './ImageOptimizer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  LAST_CACHE_CLEAR: 'last_cache_clear',
  CACHE_VERSION: 'cache_version',
  FORCE_REFRESH: 'force_refresh',
};

const CACHE_CONFIG = {
  CACHE_DURATION: 1 * 60 * 60 * 1000, // 1 hour
  MAX_CACHE_AGE: 24 * 60 * 60 * 1000, // 24 hours
  VERSION_CHECK_INTERVAL: 30 * 60 * 1000, // 30 minutes
};

/**
 * Check if cache needs to be refreshed
 * @returns {Promise<boolean>} - True if cache needs refresh
 */
export const shouldRefreshCache = async () => {
  try {
    const lastClear = await AsyncStorage.getItem(CACHE_KEYS.LAST_CACHE_CLEAR);
    const now = Date.now();
    
    if (!lastClear) {
      return true; // First time, refresh cache
    }
    
    const timeSinceLastClear = now - parseInt(lastClear);
    return timeSinceLastClear > CACHE_CONFIG.CACHE_DURATION;
  } catch (error) {
    console.error('Error checking cache refresh status:', error);
    return true; // On error, refresh cache
  }
};

/**
 * Mark cache as refreshed
 */
export const markCacheRefreshed = async () => {
  try {
    const timestamp = Date.now().toString();
    await AsyncStorage.setItem(CACHE_KEYS.LAST_CACHE_CLEAR, timestamp);
    console.log('Cache marked as refreshed at:', timestamp);
  } catch (error) {
    console.error('Error marking cache as refreshed:', error);
  }
};

/**
 * Clear all caches and mark as refreshed
 */
export const refreshAllCaches = async () => {
  try {
    console.log('Refreshing all caches...');
    
    // Clear image cache
    await clearImageCache();
    
    // Mark as refreshed
    await markCacheRefreshed();
    
    console.log('All caches refreshed successfully');
    return true;
  } catch (error) {
    console.error('Error refreshing caches:', error);
    return false;
  }
};

/**
 * Force refresh specific image
 * @param {string} imageUrl - Image URL to refresh
 * @param {string} usage - Image usage type
 * @param {number} quality - Image quality
 * @returns {string} - New URL with cache busting
 */
export const forceRefreshImage = (imageUrl, usage = 'product', quality = 80) => {
  return getForceRefreshImageUrl(imageUrl, usage, quality);
};

/**
 * Check if app should force refresh on startup
 * @returns {Promise<boolean>} - True if should force refresh
 */
export const shouldForceRefreshOnStartup = async () => {
  try {
    const lastVersionCheck = await AsyncStorage.getItem(CACHE_KEYS.VERSION_CHECK_INTERVAL);
    const now = Date.now();
    
    if (!lastVersionCheck) {
      return true; // First time, force refresh
    }
    
    const timeSinceLastCheck = now - parseInt(lastVersionCheck);
    return timeSinceLastCheck > CACHE_CONFIG.VERSION_CHECK_INTERVAL;
  } catch (error) {
    console.error('Error checking force refresh status:', error);
    return true;
  }
};

/**
 * Mark version check as completed
 */
export const markVersionCheckCompleted = async () => {
  try {
    const timestamp = Date.now().toString();
    await AsyncStorage.setItem(CACHE_KEYS.VERSION_CHECK_INTERVAL, timestamp);
    console.log('Version check marked as completed at:', timestamp);
  } catch (error) {
    console.error('Error marking version check completed:', error);
  }
};

/**
 * Get cache statistics
 * @returns {Promise<object>} - Cache statistics
 */
export const getCacheStats = async () => {
  try {
    const lastClear = await AsyncStorage.getItem(CACHE_KEYS.LAST_CACHE_CLEAR);
    const now = Date.now();
    
    return {
      lastCacheClear: lastClear ? new Date(parseInt(lastClear)) : null,
      timeSinceLastClear: lastClear ? now - parseInt(lastClear) : null,
      shouldRefresh: await shouldRefreshCache(),
      cacheDuration: CACHE_CONFIG.CACHE_DURATION,
      maxCacheAge: CACHE_CONFIG.MAX_CACHE_AGE,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
};

/**
 * Clear old cache data
 */
export const clearOldCache = async () => {
  try {
    const stats = await getCacheStats();
    
    if (stats && stats.timeSinceLastClear > CACHE_CONFIG.MAX_CACHE_AGE) {
      console.log('Clearing old cache data...');
      await refreshAllCaches();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error clearing old cache:', error);
    return false;
  }
};

/**
 * Initialize cache management
 * @returns {Promise<boolean>} - True if cache was refreshed
 */
export const initializeCache = async () => {
  try {
    console.log('Initializing cache management...');
    
    // Clear image cache on startup
    await clearImageCache();
    
    // Set up periodic refresh (every 30 minutes)
    setupPeriodicRefresh();
    
    console.log('Cache management initialized with periodic refresh');
    return true;
  } catch (error) {
    console.error('Error initializing cache:', error);
    return false;
  }
};

/**
 * Set up periodic refresh for auto-updating data
 */
export const setupPeriodicRefresh = () => {
  // Clear image cache every 30 minutes
  setInterval(async () => {
    try {
      console.log('Periodic cache refresh...');
      await clearImageCache();
      console.log('Periodic cache refresh completed');
    } catch (error) {
      console.error('Error in periodic cache refresh:', error);
    }
  }, 30 * 60 * 1000); // 30 minutes
};

export default {
  shouldRefreshCache,
  markCacheRefreshed,
  refreshAllCaches,
  forceRefreshImage,
  shouldForceRefreshOnStartup,
  markVersionCheckCompleted,
  getCacheStats,
  clearOldCache,
  initializeCache,
};
