/**
 * Image Optimization Utility
 * Provides optimized image loading with caching, compression, and lazy loading
 */

import FastImage from 'react-native-fast-image';
import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Get optimized image dimensions based on screen size and usage
 * @param {string} usage - 'banner', 'thumbnail', 'product', 'category', 'brand'
 * @param {number} aspectRatio - width/height ratio
 * @returns {object} - {width, height}
 */
export const getOptimizedDimensions = (usage, aspectRatio = 1) => {
  const baseWidth = screenWidth;
  
  switch (usage) {
    case 'banner':
      return {
        width: baseWidth,
        height: Math.round(baseWidth * 0.5), // 2:1 aspect ratio
      };
    
    case 'thumbnail':
      return {
        width: Math.round(baseWidth * 0.3),
        height: Math.round(baseWidth * 0.3),
      };
    
    case 'product':
      return {
        width: Math.round(baseWidth * 0.45),
        height: Math.round(baseWidth * 0.45 * aspectRatio),
      };
    
    case 'category':
      return {
        width: Math.round(baseWidth * 0.2),
        height: Math.round(baseWidth * 0.2),
      };
    
    case 'brand':
      return {
        width: Math.round(baseWidth * 0.25),
        height: Math.round(baseWidth * 0.25),
      };
    
    default:
      return {
        width: baseWidth,
        height: Math.round(baseWidth * aspectRatio),
      };
  }
};

/**
 * Get optimized image URL with compression parameters and cache busting
 * @param {string} originalUrl - Original image URL
 * @param {string} usage - Image usage type
 * @param {number} quality - Image quality (1-100)
 * @param {boolean} enableCacheBusting - Enable cache busting for updates
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (originalUrl, usage = 'product', quality = 80, enableCacheBusting = true) => {
  if (!originalUrl || typeof originalUrl !== 'string') {
    return null;
  }

  // If it's already a WordPress image, add compression parameters
  if (originalUrl.includes('wp-content/uploads')) {
    const dimensions = getOptimizedDimensions(usage);
    
    // Build parameters manually for React Native compatibility
    const params = [];
    params.push(`w=${dimensions.width}`);
    params.push(`h=${dimensions.height}`);
    params.push(`q=${quality}`);
    params.push(`f=webp`); // Use WebP format for better compression
    
    // Add cache busting parameter if enabled
    if (enableCacheBusting) {
      // More aggressive cache busting - every 15 minutes for faster updates
      const cacheBuster = Math.floor(Date.now() / (1000 * 60 * 15)); // 15 minutes cache
      params.push(`cb=${cacheBuster}`);
    }
    
    // Add parameters to URL
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}${params.join('&')}`;
  }
  
  // For other URLs, add cache busting if enabled
  if (enableCacheBusting) {
    const separator = originalUrl.includes('?') ? '&' : '?';
    const cacheBuster = Math.floor(Date.now() / (1000 * 60 * 15)); // 15 minutes cache
    return `${originalUrl}${separator}cb=${cacheBuster}`;
  }
  
  return originalUrl;
};

/**
 * Get FastImage priority based on usage
 * @param {string} usage - Image usage type
 * @returns {string} - FastImage priority
 */
export const getImagePriority = (usage) => {
  switch (usage) {
    case 'banner':
      return FastImage.priority.high;
    case 'product':
      return FastImage.priority.normal;
    case 'thumbnail':
    case 'category':
    case 'brand':
      return FastImage.priority.low;
    default:
      return FastImage.priority.normal;
  }
};

/**
 * Get FastImage cache control
 * @param {string} usage - Image usage type
 * @returns {string} - FastImage cache control
 */
export const getImageCacheControl = (usage) => {
  switch (usage) {
    case 'banner':
      return FastImage.cacheControl.web; // Cache for web session - can be updated
    case 'product':
      return FastImage.cacheControl.web; // Cache for web session - can be updated
    case 'thumbnail':
    case 'category':
    case 'brand':
      return FastImage.cacheControl.web; // Cache for web session - can be updated
    default:
      return FastImage.cacheControl.web;
  }
};

/**
 * Preload images for better performance
 * @param {Array} imageUrls - Array of image URLs to preload
 * @param {string} usage - Image usage type
 */
export const preloadImages = (imageUrls, usage = 'product') => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;
  
  const optimizedUrls = imageUrls
    .filter(url => url && typeof url === 'string')
    .map(url => ({
      uri: getOptimizedImageUrl(url, usage),
      priority: getImagePriority(usage),
      cache: getImageCacheControl(usage),
    }));
  
  if (optimizedUrls.length > 0) {
    FastImage.preload(optimizedUrls);
  }
};

/**
 * Get placeholder image based on usage
 * @param {string} usage - Image usage type
 * @returns {object} - Placeholder image source
 */
export const getPlaceholderImage = (usage) => {
  // You can add different placeholder images for different usage types
  return {
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent pixel
  };
};

/**
 * Clear image cache
 * @param {string} url - Specific URL to clear (optional)
 */
export const clearImageCache = async (url = null) => {
  try {
    if (url) {
      // Clear specific URL
      await FastImage.clearMemoryCache();
      await FastImage.clearDiskCache();
    } else {
      // Clear all cache
      await FastImage.clearMemoryCache();
      await FastImage.clearDiskCache();
    }
    console.log('Image cache cleared successfully');
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
};

/**
 * Force refresh image by bypassing cache
 * @param {string} originalUrl - Original image URL
 * @param {string} usage - Image usage type
 * @param {number} quality - Image quality (1-100)
 * @returns {string} - URL with cache busting
 */
export const getForceRefreshImageUrl = (originalUrl, usage = 'product', quality = 80) => {
  if (!originalUrl || typeof originalUrl !== 'string') {
    return null;
  }

  // Force cache busting with current timestamp
  const cacheBuster = Date.now();
  
  if (originalUrl.includes('wp-content/uploads')) {
    const dimensions = getOptimizedDimensions(usage);
    
    // Build parameters manually for React Native compatibility
    const params = [];
    params.push(`w=${dimensions.width}`);
    params.push(`h=${dimensions.height}`);
    params.push(`q=${quality}`);
    params.push(`f=webp`);
    params.push(`cb=${cacheBuster}`); // Force refresh
    
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}${params.join('&')}`;
  }
  
  const separator = originalUrl.includes('?') ? '&' : '?';
  return `${originalUrl}${separator}cb=${cacheBuster}`;
};

/**
 * Image optimization configuration
 */
export const ImageOptimizationConfig = {
  // Quality settings
  qualities: {
    banner: 90,
    product: 85,
    thumbnail: 80,
    category: 75,
    brand: 80,
  },
  
  // Cache settings
  cache: {
    maxSize: 100 * 1024 * 1024, // 100MB
    maxAge: 1 * 60 * 60 * 1000, // 1 hour (reduced from 7 days)
    enableCacheBusting: true, // Enable automatic cache busting
  },
  
  // Lazy loading settings
  lazyLoading: {
    threshold: 200, // Load images 200px before they come into view
    placeholder: true,
  },
};

export default {
  getOptimizedDimensions,
  getOptimizedImageUrl,
  getImagePriority,
  getImageCacheControl,
  preloadImages,
  getPlaceholderImage,
  clearImageCache,
  getForceRefreshImageUrl,
  ImageOptimizationConfig,
};
