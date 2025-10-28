import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const SkeletonLoader = ({
  width,
  height,
  borderRadius = 4,
  style,
  children,
  isLoading = true,
  backgroundColor = '#f0f0f0',
  highlightColor = '#e0e0e0',
  animationDuration = 1000,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isLoading, animatedValue, animationDuration]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  if (!isLoading) {
    return children;
  }

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            width: width * 0.3,
            height,
            backgroundColor: highlightColor,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

// Preset skeleton loaders untuk berbagai komponen
export const BannerSkeleton = ({ width = screenWidth, height = 200, style }) => (
  <SkeletonLoader
    width={width}
    height={height}
    borderRadius={8}
    style={style}
  />
);

export const CategorySkeleton = ({ size = 80, style }) => (
  <SkeletonLoader
    width={size}
    height={size}
    borderRadius={size / 2}
    style={style}
  />
);

export const BrandSkeleton = ({ width = 100, height = 60, style }) => (
  <SkeletonLoader
    width={width}
    height={height}
    borderRadius={8}
    style={style}
  />
);

export const ProductSkeleton = ({ width = 150, height = 200, style }) => (
  <SkeletonLoader
    width={width}
    height={height}
    borderRadius={8}
    style={style}
  />
);

export const TextSkeleton = ({ width = '100%', height = 16, style }) => (
  <SkeletonLoader
    width={width}
    height={height}
    borderRadius={4}
    style={style}
  />
);

export const CardSkeleton = ({ width = '100%', height = 120, style }) => (
  <SkeletonLoader
    width={width}
    height={height}
    borderRadius={12}
    style={style}
  />
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.6,
  },
});

export default SkeletonLoader;