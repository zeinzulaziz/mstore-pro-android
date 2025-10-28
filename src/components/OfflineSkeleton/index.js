import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {withTheme} from '@common';
import {CategorySkeleton, BrandSkeleton, ProductSkeleton, CardSkeleton} from '../SkeletonLoader';

const {width} = Dimensions.get('window');

const OfflineSkeleton = ({theme}) => {
  const {colors: {text}} = theme;

  // Dummy data untuk offline mode
  const dummyCategories = Array.from({length: 10}, (_, i) => ({id: i}));
  const dummyBrands = Array.from({length: 4}, (_, i) => ({id: i}));
  const dummyProducts = Array.from({length: 6}, (_, i) => ({id: i}));

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Categories Section */}
      <View style={{padding: 15, marginBottom: 20}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: text, marginBottom: 15}}>
          Categories
        </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          {dummyCategories.map((_, index) => (
            <View key={index} style={{width: '18%', alignItems: 'center', marginBottom: 15}}>
              <CategorySkeleton size={60} />
              <View style={{marginTop: 8, width: 50, height: 12, backgroundColor: '#f0f0f0', borderRadius: 6}} />
            </View>
          ))}
        </View>
      </View>

      {/* Flash Sale Section */}
      <View style={{padding: 15, marginBottom: 20}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: text}}>
            Flash Sale
          </Text>
          <Text style={{color: '#f08e4b', fontSize: 14}}>Show All</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {dummyProducts.map((_, index) => (
            <View key={index} style={{width: (width - 60) / 3}}>
              <ProductSkeleton width={(width - 60) / 3} height={120} />
              <View style={{marginTop: 8, height: 12, backgroundColor: '#f0f0f0', borderRadius: 6}} />
              <View style={{marginTop: 4, height: 10, backgroundColor: '#f0f0f0', borderRadius: 5, width: '60%'}} />
            </View>
          ))}
        </View>
      </View>

      {/* Featured Brands Section */}
      <View style={{padding: 15}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: text, marginBottom: 5}}>
          Featured Brands
        </Text>
        <Text style={{color: text, marginBottom: 15, opacity: 0.7}}>
          Discover our trusted brands
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {dummyBrands.map((_, index) => (
            <View key={index} style={{width: (width - 60) / 4, alignItems: 'center'}}>
              <BrandSkeleton width={60} height={40} />
              <View style={{marginTop: 8, height: 12, backgroundColor: '#f0f0f0', borderRadius: 6, width: '80%'}} />
              <View style={{marginTop: 4, height: 10, backgroundColor: '#f0f0f0', borderRadius: 5, width: '60%'}} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default withTheme(OfflineSkeleton);
