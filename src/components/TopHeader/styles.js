/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Fonts} from '@common';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Higher z-index to ensure it's above banner
    paddingTop: Platform.OS === 'android' ? 24 : 24, // Add more padding for status bar clearance
    paddingBottom: Platform.OS === 'android' ? 0 : 0, // Remove bottom padding to eliminate space
    backgroundColor: 'transparent', // Remove white background to show gradient
  },
  gradientBackground: {
    position: 'absolute',
    top: 0, // Start gradient from the very top
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  radialBase: {
    position: 'absolute',
    top: 0, // Start from the very top
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialGradient1: {
    position: 'absolute',
    top: 0, // Start from the very top
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialGradient2: {
    position: 'absolute',
    top: 0, // Start from the very top
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialGradient3: {
    position: 'absolute',
    top: 0, // Start from the very top
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    zIndex: 2, // Higher than container but lower than banner
  },
  logoContainer: {
    marginRight: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
    fontFamily: Fonts.regular,
  },
  searchButton: {
    backgroundColor: '#e39c7a',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  refreshButton: {
    backgroundColor: '#e39c7a',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContainer: {
    position: 'relative',
    padding: 8,
    marginLeft: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.bold,
  },
});
