import React, { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '@common';

const { width, height } = Dimensions.get('window');
// Center the grid properly with equal margins
const horizontalPadding = 10;
const gap = 20;
const columns = 5;
const totalGapWidth = gap * (columns - 1);
const availableWidth = width - (horizontalPadding * 2);
const widthItem = Math.floor((availableWidth - totalGapWidth) / columns);
const totalUsedWidth = (widthItem * columns) + totalGapWidth;
const remainingSpace = availableWidth - totalUsedWidth;
const extraPadding = Math.floor(remainingSpace / 2);

export default StyleSheet.create({
  item: {
    width: widthItem,
    marginTop: 14,
    marginRight: gap,
    alignItems: 'center',
  },
  itemLast: {
    width: widthItem,
    marginTop: 14,
    marginRight: 0, // No right margin for last item in each row
    alignItems: 'center',
  },
  imageContainer: {
    width: widthItem,
    height: widthItem,
    borderRadius: 16,
    backgroundColor: '#ecc282',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  name: {
    marginTop: 8,
    color: '#333',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: Fonts.medium,
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: horizontalPadding + extraPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  wrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
