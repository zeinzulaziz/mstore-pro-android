/** @format */

import React from 'react';
import {View, Dimensions} from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const {width} = Dimensions.get('window');

const CategorySkeleton = () => {
  // Grid layout untuk categories (5 kolom)
  const horizontalPadding = 10;
  const gap = 20;
  const columns = 5;
  const totalGapWidth = gap * (columns - 1);
  const availableWidth = width - (horizontalPadding * 2);
  const widthItem = Math.floor((availableWidth - totalGapWidth) / columns);

  return (
    <View style={{
      paddingHorizontal: horizontalPadding,
      paddingBottom: 30,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }}>
      {Array.from({length: 10}).map((_, index) => (
        <View key={index} style={{marginBottom: 20}}>
          <SkeletonLoader 
            height={widthItem} 
            borderRadius={16}
            style={{width: widthItem}}
          />
          <View style={{
            marginTop: 8,
            height: 12,
            width: widthItem * 0.8,
            alignSelf: 'center'
          }}>
            <SkeletonLoader 
              height={12} 
              borderRadius={6}
              style={{width: '100%'}}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default CategorySkeleton;
