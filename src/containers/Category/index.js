import React, {PureComponent} from 'react';
import {
  View,
  RefreshControl,
  ScrollView,
  Animated,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {isObject} from 'lodash';

import {Languages, withTheme} from '@common';
import {Timer, toast, BlockTimer} from '@app/Omni';
import {DisplayMode} from '@redux/CategoryRedux';

import {LogoSpinner, Empty} from '@components';
import {FilterPicker} from '@containers';

import ProductRow from './ProductRow';
import ControlBar from './ControlBar';
import styles from './styles';

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
  if (!text) return text;
  return text
    .replace(/&amp;/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

class CategoryScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      loadingBuffer: true,
      modalVisible: false,
      displayControlBar: true,
    };
    this.pageNumber = 1;

    this.renderList = this.renderList.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);
    this.onRowClickHandle = this.onRowClickHandle.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefreshHandle = this.onRefreshHandle.bind(this);
    this.onListViewScroll = this.onListViewScroll.bind(this);

    this.openCategoryPicker = () => this.setState({modalVisible: true});
    this.closeCategoryPicker = () => this.setState({modalVisible: false});
    this.fetchProductsByBrand = this.fetchProductsByBrand.bind(this);
    this.fetchProductsByCategory = this.fetchProductsByCategory.bind(this);
  }

  fetchProductsByBrand(brandId) {
    const {actions} = require('@redux/ProductRedux');
    const {dispatch, clearProducts, brand} = this.props;
    
    if (!dispatch) {
      console.error('Dispatch not available in props');
      return;
    }
    
    // Clear existing products first
    console.log('Clearing existing products...');
    clearProducts();
    
    // Use WooCommerce Store API with brand parameter for server-side filtering
    const brandName = brand ? brand.name : 'Unknown';
    const url = `https://doseofbeauty.id/wp-json/wc/store/v1/products?brand=${encodeURIComponent(brandName)}&per_page=50&page=${this.pageNumber}`;
    
    console.log('Fetching products for brand ID:', brandId, 'Brand name:', brandName, 'from URL:', url);
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Products fetched for brand:', brandName, ':', data.length, 'products');
        console.log('Sample product data:', data[0]);
        
        // Server already filtered by brand, so use all products
        const brandProducts = data;
        
        console.log('Products for brand', brandName, ':', brandProducts.length, 'products');
        
        // If no products found for this brand, show empty state
        if (brandProducts.length === 0) {
          console.log('No products found for brand:', brandName);
          dispatch(actions.fetchProductsSuccess([]));
          return;
        }
        
        // Transform data to match expected format
        const transformedProducts = brandProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.prices?.price || '0',
          regular_price: product.prices?.regular_price || '0',
          sale_price: product.prices?.sale_price || null,
          images: product.images || [],
          description: product.description || '',
          short_description: product.short_description || '',
          categories: product.categories || [],
          tags: product.tags || [],
          attributes: product.attributes || [],
          variations: product.variations || [],
          stock_status: product.is_in_stock ? 'instock' : 'outofstock',
          stock_quantity: product.stock_quantity || 0,
          weight: product.weight || '',
          dimensions: product.dimensions || {},
          permalink: product.permalink || '',
          _brand: product.brands && product.brands[0] ? product.brands[0] : null,
        }));
        
        console.log('Transformed products:', transformedProducts.length, 'products');
        console.log('Sample transformed product:', transformedProducts[0]);
        
        // Dispatch to Redux store
        console.log('Dispatching products to Redux...');
        dispatch(actions.fetchProductsSuccess(transformedProducts));
        console.log('Products dispatched to Redux successfully');
        
        // Check Redux state after dispatch
        setTimeout(() => {
          const {products} = this.props;
          console.log('Redux state after dispatch - products.list length:', products.list ? products.list.length : 0);
        }, 100);
      })
      .catch(error => {
        console.error('Error fetching products by brand:', error);
        dispatch(actions.fetchProductsFailure(error.message));
      });
  }

  fetchProductsByCategory(categoryId, shouldAppend = false) {
    const {actions} = require('@redux/ProductRedux');
    const {dispatch, category, products} = this.props;
    
    if (!dispatch) {
      console.error('Dispatch not available in props');
      return;
    }
    
    // Don't clear products if we're appending (pagination)
    if (!shouldAppend) {
      console.log('Clearing existing products...');
      const {clearProducts} = this.props;
      clearProducts();
    }
    
    // Use WooCommerce Store API with category parameter for server-side filtering
    const categoryName = category ? category.name : 'Unknown';
    const url = `https://doseofbeauty.id/wp-json/wc/store/v1/products?category=${categoryId}&per_page=50&page=${this.pageNumber}`;
    
    console.log('Fetching products for category ID:', categoryId, 'Category name:', categoryName, 'Page:', this.pageNumber, 'shouldAppend:', shouldAppend, 'from URL:', url);
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Products fetched for category:', categoryName, ':', data.length, 'products');
        console.log('Sample product data:', data[0]);
        
        // Server already filtered by category, so use all products
        const categoryProducts = data;
        
        console.log('Products for category', categoryName, ':', categoryProducts.length, 'products');
        
        // If no products found for this category, show empty state
        if (categoryProducts.length === 0) {
          console.log('No products found for category:', categoryName);
          dispatch(actions.fetchProductsSuccess([]));
          return;
        }
        
        // Transform data to match expected format
        const transformedProducts = categoryProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.prices?.price || '0',
          regular_price: product.prices?.regular_price || '0',
          sale_price: product.prices?.sale_price || null,
          images: product.images || [],
          description: product.description || '',
          short_description: product.short_description || '',
          categories: product.categories || [],
          tags: product.tags || [],
          attributes: product.attributes || [],
          variations: product.variations || [],
          stock_status: product.is_in_stock ? 'instock' : 'outofstock',
          stock_quantity: product.stock_quantity || 0,
          weight: product.weight || '',
          dimensions: product.dimensions || {},
          permalink: product.permalink || '',
          _brand: product.brands && product.brands[0] ? product.brands[0] : null,
        }));
        
        console.log('Transformed products:', transformedProducts.length, 'products');
        console.log('Sample transformed product:', transformedProducts[0]);
        
        // If shouldAppend, merge with existing products
        let finalProducts = transformedProducts;
        if (shouldAppend && products.list && products.list.length > 0) {
          finalProducts = [...products.list, ...transformedProducts];
          console.log('Appending', transformedProducts.length, 'new products to', products.list.length, 'existing. Total:', finalProducts.length);
        } else {
          console.log('Dispatching', transformedProducts.length, 'products to Redux...');
        }
        
        dispatch(actions.fetchProductsSuccess(finalProducts));
        console.log('Products dispatched to Redux successfully');
        
        // Check Redux state after dispatch
        setTimeout(() => {
          const {products} = this.props;
          console.log('Redux state after dispatch - products.list length:', products.list ? products.list.length : 0);
        }, 100);
      })
      .catch(error => {
        console.error('Error fetching products by category:', error);
        dispatch(actions.fetchProductsFailure(error.message));
      });
  }

  componentDidMount() {
    Timer.setTimeout(() => this.setState({loadingBuffer: false}), 1000);

    const {fetchProductsByCategoryId, clearProducts, selectedCategory, brand, category} =
      this.props;
    clearProducts();
    
    // If brand is provided, fetch products by brand
    if (brand) {
      console.log('Fetching products for brand:', brand.name, 'ID:', brand.id);
      this.fetchProductsByBrand(brand.id);
    } else if (category) {
      console.log('Fetching products for category:', category.name, 'ID:', category.id);
      this.fetchProductsByCategory(category.id, false); // false = initial load, not appending
    } else if (selectedCategory) {
      fetchProductsByCategoryId(selectedCategory.id, this.pageNumber++);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const props = this.props;
    const {error} = nextProps.products;
    if (error) toast(error);

    if (props.filters !== nextProps.filters) {
      this.newFilters = this._getFilterId(nextProps.filters);

      this.pageNumber = 1;
      props.clearProducts();
      props.fetchProductsByCategoryId(
        null,
        this.pageNumber++,
        20,
        this.newFilters,
      );
    }

    if (props.selectedCategory != nextProps.selectedCategory) {
      this.pageNumber = 1;
      props.clearProducts();
      props.fetchProductsByCategoryId(
        nextProps.selectedCategory.id,
        this.pageNumber++,
      );
    }
  }

  _getFilterId = filters => {
    let newFilters = {};
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value) {
        newFilters = {
          ...newFilters,
          [key]: isObject(value) ? value.id || value.term_id : value,
        };
      }
    });
    // warn(newFilters);
    if (newFilters.price) {
      newFilters.max_price = newFilters.price;
      delete newFilters.price;
    }
    if (!newFilters.category) {
      newFilters.category = this.props.selectedCategory.id;
    }
    return newFilters;
  };

  render() {
    const {modalVisible, loadingBuffer, displayControlBar} = this.state;
    const {products, selectedCategory, filters, fetchProductsByCategoryId, brand, category, title} =
      this.props;
    const {
      theme: {
        colors: {background},
      },
    } = this.props;

    console.log('Category render - products:', products);
    console.log('Category render - products.list:', products.list);
    console.log('Category render - products.list length:', products.list ? products.list.length : 0);
    console.log('Category render - brand:', brand);
    console.log('Category render - category:', category);
    console.log('Category render - selectedCategory:', selectedCategory);

    if (!selectedCategory && !brand && !category) return null;

    if (products.error) {
      return <Empty text={products.error} />;
    }

    if (loadingBuffer) {
      return <LogoSpinner fullStretch />;
    }

    const marginControlBar = this.state.scrollY.interpolate({
      inputRange: [-100, 0, 40, 50],
      outputRange: [0, 0, -50, -50],
    });

    const name =
      title || // Use title from navigation params
      (filters && filters.category && decodeHtmlEntities(filters.category.name)) ||
      (brand && decodeHtmlEntities(brand.name)) ||
      (category && decodeHtmlEntities(category.name)) ||
      (selectedCategory && decodeHtmlEntities(selectedCategory.name));

    return (
      <View style={[styles.container, {backgroundColor: background}]}>
        <Animated.View style={{marginTop: marginControlBar}}>
          <ControlBar
            isVisible={displayControlBar}
            name={name}
          />
        </Animated.View>
        {this.renderList(products.list)}
        <FilterPicker
          closeModal={this.closeCategoryPicker}
          visible={modalVisible}
        />
      </View>
    );
  }

  renderList = data => {
    const {products, displayMode} = this.props;
    const isCardMode = displayMode == DisplayMode.CardMode;

    console.log('renderList called with data:', data);
    console.log('renderList data length:', data ? data.length : 0);
    console.log('renderList data type:', typeof data);
    console.log('renderList data is array:', Array.isArray(data));

    return (
      <FlatList
        keyExtractor={(item, index) => `${item.id}`}
        data={data}
        renderItem={this.renderRow}
        enableEmptySections
        onEndReached={this.onEndReached}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={isCardMode ? false : products.isFetching}
            onRefresh={this.onRefreshHandle}
          />
        }
        contentContainerStyle={styles.listView}
        initialListSize={6}
        pageSize={2}
        renderScrollComponent={this.renderScrollComponent}
      />
    );
  };

  renderRow = product => {
    const {displayMode, currency} = this.props;
    const onPress = () => this.onRowClickHandle(product.item);
    const isInWishList =
      this.props.wishListItems.find(item => item.product.id === product.id) !==
      undefined;

    return (
      <ProductRow
        product={product.item}
        onPress={onPress}
        displayMode={displayMode}
        wishListItems={this.props.wishListItems}
        isInWishList={isInWishList}
        addToWishList={this.addToWishList}
        removeWishListItem={this.removeWishListItem}
        currency={currency}
      />
    );
  };

  renderScrollComponent = props => {
    const {displayMode} = this.props;
    const mergeOnScroll = event => {
      props.onScroll(event);
      this.onListViewScroll(event);
    };

    if (displayMode == DisplayMode.CardMode) {
      return (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          props
          {...props}
          onScroll={mergeOnScroll}
        />
      );
    }

    return <ScrollView props {...props} onScroll={mergeOnScroll} />;
  };

  addToWishList = product => {
    this.props.addWishListItem(product);
  };

  removeWishListItem = product => {
    this.props.removeWishListItem(product);
  };

  onRowClickHandle = product => {
    BlockTimer.execute(() => {
      this.props.onViewProductScreen({product});
    }, 500);
  };

  onEndReached = () => {
    const {products, fetchProductsByCategoryId, selectedCategory, brand, category} = this.props;
    if (!products.isFetching && products.stillFetch) {
      if (brand) {
        // Load more products for brand
        this.pageNumber++;
        this.fetchProductsByBrand(brand.id);
      } else if (category) {
        // Load more products for category
        this.pageNumber++;
        this.fetchProductsByCategory(category.id, true); // true = append to existing products
      } else if (this.newFilters) {
        fetchProductsByCategoryId(
          selectedCategory.id,
          this.pageNumber++,
          20,
          this.newFilters,
        );
      } else {
        fetchProductsByCategoryId(selectedCategory.id, this.pageNumber++);
      }
    }
  };

  onRefreshHandle = () => {
    const {fetchProductsByCategoryId, clearProducts, selectedCategory, brand, category} =
      this.props;
    this.pageNumber = 1;
    clearProducts();
    
    if (brand) {
      this.fetchProductsByBrand(brand.id);
    } else if (category) {
      this.fetchProductsByCategory(category.id, false); // false = refresh, not appending
    } else {
      fetchProductsByCategoryId(
        selectedCategory.id,
        this.pageNumber++,
        20,
        this.newFilters,
      );
    }
  };

  onListViewScroll(event) {
    this.state.scrollY.setValue(event.nativeEvent.contentOffset.y);
  }
}

const mapStateToProps = state => {
  return {
    selectedCategory: state.categories.selectedCategory,
    netInfo: state.netInfo,
    displayMode: state.categories.displayMode,
    products: state.products,
    wishListItems: state.wishList.wishListItems,
    filters: state.filters,
    currency: state.currency,
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {netInfo} = stateProps;
  const {dispatch} = dispatchProps;
  const {actions} = require('@redux/ProductRedux');
  const WishListRedux = require('@redux/WishListRedux');
  return {
    ...ownProps,
    ...stateProps,
    dispatch, // Add dispatch to props
    fetchProductsByCategoryId: (
      categoryId,
      page,
      per_page = 20,
      filters = {},
    ) => {
      if (!netInfo.isConnected) return toast(Languages.noConnection);
      actions.fetchProductsByCategoryId(
        dispatch,
        categoryId,
        per_page,
        page,
        filters,
      );
    },
    clearProducts: () => dispatch(actions.clearProducts()),
    addWishListItem: product => {
      WishListRedux.actions.addWishListItem(dispatch, product, null);
    },
    removeWishListItem: (product, variation) => {
      WishListRedux.actions.removeWishListItem(dispatch, product, null);
    },
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(withTheme(CategoryScreen));
