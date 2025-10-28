import React from 'react';
import {Search} from '@components';

const SearchScreen = React.memo(({navigation, route}) => {
  const {navigate, goBack} = navigation;
  const {searchText} = route.params || {};

  return (
    <Search
      onBack={goBack}
      onViewProductScreen={product => navigate('DetailScreen', product)}
      navigation={navigation}
      onFilter={onSearch => navigate('FiltersScreen', {onSearch})}
      initialSearchText={searchText}
    />
  );
});

export default SearchScreen;
