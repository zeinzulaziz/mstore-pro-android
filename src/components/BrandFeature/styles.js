/** @format */

import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '@common';

const {width} = Dimensions.get('window');

const brandItemWidth = (width - 32 - 24) / 4; // 4 items per row with margins and padding

export default StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: Fonts.regular,
  },
  brandsList: {
    paddingRight: 16,
  },
  marqueeContainer: {
    height: 120, // Fixed height for marquee
    overflow: 'hidden',
  },
  marqueeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandItem: {
    width: brandItemWidth,
    alignItems: 'center',
    marginRight: 8,
  },
  lastBrandItem: {
    marginRight: 0,
  },
  brandImageContainer: {
    width: brandItemWidth,
    height: brandItemWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brandImage: {
    width: brandItemWidth * 0.7,
    height: brandItemWidth * 0.7,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: Fonts.medium,
  },
  brandCount: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 2,
    fontFamily: Fonts.regular,
  },
  separator: {
    width: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: Fonts.regular,
  },
  placeholderContainer: {
    width: brandItemWidth * 0.7,
    height: brandItemWidth * 0.7,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6c757d',
    fontFamily: Fonts.bold,
  },
  progressDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
