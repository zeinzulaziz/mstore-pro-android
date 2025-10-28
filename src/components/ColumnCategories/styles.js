import React, { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
// Compact grid: 5 columns with 12px gaps and 16px horizontal padding
const horizontalPadding = 16;
const gap = 12;
const columns = 5;
const widthItem = (width - horizontalPadding * 2 - gap * (columns - 1)) / columns;

export default StyleSheet.create({
  item: {
    width: widthItem,
    marginTop: 14,
    marginRight: gap,
    alignItems: 'center',
  },
  image: {
    width: widthItem,
    height: widthItem,
    borderRadius: 16,
  },
  name: {
    marginTop: 8,
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  list: {
    paddingBottom: 5,
    paddingHorizontal: horizontalPadding,
  },
});
