/** @format */

import * as React from 'react';

import { Category } from '@containers';

const CategoryScreen = ({ navigation, route }) => {
  // Get brand or category data from navigation params
  const brand = route?.params?.brand;
  const category = route?.params?.category;
  const title = route?.params?.title;
  
  return (
    <Category
      brand={brand}
      category={category}
      title={title}
      onViewProductScreen={item => {
        navigation.navigate('DetailScreen', item);
      }}
    />
  );
};

export default CategoryScreen;
