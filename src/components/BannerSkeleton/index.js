/** @format */

import React from 'react';
import {View, Dimensions} from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const {width} = Dimensions.get('window');

const BannerSkeleton = () => {
  return (
    <View style={{width, height: 200, paddingHorizontal: 10}}>
      <SkeletonLoader 
        height={200} 
        borderRadius={15}
        style={{width: '100%'}}
      />
    </View>
  );
};

export default BannerSkeleton;
