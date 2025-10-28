/**
 * OptimizedImage Component
 * Provides optimized image loading with caching, compression, and lazy loading
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getOptimizedImageUrl, getImagePriority, getImageCacheControl, getPlaceholderImage } from '@utils/ImageOptimizer';
import { Images } from '@common';

const { width: screenWidth } = Dimensions.get('window');

const OptimizedImage = ({
  source,
  style,
  usage = 'product',
  quality,
  showLoadingIndicator = true,
  showErrorIndicator = true,
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  resizeMode = 'cover',
  placeholder,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Get optimized image URL
  const optimizedUrl = getOptimizedImageUrl(source?.uri || source, usage, quality);
  
  // Get placeholder image based on usage
  const getPlaceholderForUsage = (usage) => {
    switch (usage) {
      case 'category':
        return Images.categoryPlaceholder;
      case 'banner':
        return Images.PlaceHolder;
      case 'product':
        return Images.PlaceHolder;
      default:
        return placeholder || getPlaceholderImage(usage);
    }
  };
  
  const placeholderImage = getPlaceholderForUsage(usage);

  // Handle load start
  const handleLoadStart = useCallback(() => {
    if (mountedRef.current) {
      setLoading(true);
      setError(false);
      setImageLoaded(false);
      onLoadStart?.();
    }
  }, [onLoadStart]);

  // Handle load success
  const handleLoad = useCallback((event) => {
    if (mountedRef.current) {
      setLoading(false);
      setError(false);
      setImageLoaded(true);
      onLoad?.(event);
      onLoadEnd?.();
    }
  }, [onLoad, onLoadEnd]);

  // Handle load error
  const handleError = useCallback((event) => {
    if (mountedRef.current) {
      console.log('OptimizedImage error for usage:', usage, 'source:', source, 'placeholderImage:', placeholderImage);
      setLoading(false);
      setError(true);
      setImageLoaded(false);
      onError?.(event);
      onLoadEnd?.();
    }
  }, [onError, onLoadEnd, usage, source, placeholderImage]);

  // Get image source
  const imageSource = optimizedUrl ? { uri: optimizedUrl } : placeholderImage;

  // Get FastImage props
  const fastImageProps = {
    source: imageSource,
    style: [styles.image, style],
    resizeMode: resizeMode,
    priority: getImagePriority(usage),
    cache: getImageCacheControl(usage),
    onLoadStart: handleLoadStart,
    onLoad: handleLoad,
    onError: handleError,
    ...props,
  };

  return (
    <View style={[styles.container, style]}>
      {/* Main Image */}
      <FastImage
        {...fastImageProps}
        style={[
          styles.image,
          style,
          { opacity: imageLoaded ? 1 : 0 }
        ]}
      />
      
      {/* Loading Indicator */}
      {loading && showLoadingIndicator && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#666" />
        </View>
      )}
      
      {/* Error Indicator */}
      {error && showErrorIndicator && (
        <View style={styles.errorContainer}>
          <FastImage
            source={placeholderImage}
            style={[styles.image, style]}
            resizeMode={resizeMode}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default OptimizedImage;
