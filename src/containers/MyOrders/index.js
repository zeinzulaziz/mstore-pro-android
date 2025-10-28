import React, {PureComponent} from 'react';
import {Animated, Platform, RefreshControl, FlatList, View, TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';

import {AnimatedHeader} from '@components';
import {Languages, withTheme} from '@common';

import OrderEmpty from './Empty';
import OrderItem from './OrderItem';

import styles from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyOrders extends PureComponent {
  state = {
    scrollY: new Animated.Value(0),
    isRefreshing: false
  };

  componentDidMount() {
    console.log('📱 MyOrders component mounted - auto refreshing...');
    this.setState({ isRefreshing: true });
    this.fetchProductsData();
    
    // Auto refresh once when component mounts
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1500);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.carts.cartItems != nextProps.carts.cartItems) {
      this.fetchProductsData();
    }
  }

  fetchProductsData = () => {
    const {user} = this.props.user;
    console.log('🔄 MyOrders fetchProductsData called');
    console.log('👤 User from props:', user);
    
    if (typeof user === 'undefined' || user === null) {
      console.log('❌ User is undefined or null, cannot fetch orders');
      return;
    }

    console.log('✅ Calling fetchMyOrder with user:', user);
    this.props.fetchMyOrder(user);
  };

  onRefresh = () => {
    console.log('🔄 Pull-to-refresh triggered!');
    this.setState({ isRefreshing: true });
    this.fetchProductsData();
    
    // Reset refreshing state after a short delay
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1000);
  };

  renderError(error) {
    return (
      <OrderEmpty
        text={error}
        onReload={this.fetchProductsData}
        onViewHome={this.props.onViewHomeScreen}
      />
    );
  }

  renderRow = ({item, index}) => {
    return (
      <OrderItem
        key={index.toString()}
        item={item}
        theme={this.props.theme}
        onViewOrderDetail={this.props.onViewOrderDetail}
      />
    );
  };

  render() {
    const data = this.props.carts.myOrders;
    const {
      theme: {
        colors: {background},
      },
    } = this.props;

    console.log('📱 MyOrders render called');
    console.log('📋 Orders data:', data);
    console.log('📊 Data type:', typeof data);
    console.log('📊 Data length:', data?.length);
    console.log('🔄 Is fetching:', this.props.carts.isFetching);

    if (typeof data === 'undefined' || data.length == 0) {
      console.log('❌ No orders found, showing empty state');
      return (
        <OrderEmpty
          text={Languages.NoOrder}
          onReload={this.fetchProductsData}
          onViewHome={this.props.onViewHomeScreen}
        />
      );
    }

    return (
      <View style={[styles.listView, {backgroundColor: background}]}>
        <AnimatedHeader
          scrollY={this.state.scrollY}
          label={Languages.MyOrder}
          activeSections={this.state.activeSection}
        />
        <AnimatedFlatList
          data={data}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {useNativeDriver: Platform.OS !== 'android'},
          )}
          scrollEventThrottle={1}
          keyExtractor={(item, index) => `${item.id} || ${index}`}
          contentContainerStyle={styles.flatlist}
          ListEmptyComponent={() => null}
          ListFooterComponent={() => (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={this.onRefresh}
                style={{
                  backgroundColor: '#FF6B35',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {Languages?.Reload || 'Reload Orders'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={this.renderRow}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              colors={['#FF6B35']} // Android
              tintColor="#FF6B35" // iOS
              title="Pull to refresh"
              titleColor="#666"
            />
          }
        />
      </View>
    );
  }
}
const mapStateToProps = ({user, carts}) => ({user, carts});
function mergeProps(stateProps, dispatchProps, ownProps) {
  const {dispatch} = dispatchProps;
  const {actions} = require('@redux/CartRedux');
  return {
    ...ownProps,
    ...stateProps,
    fetchMyOrder: user => {
      actions.fetchMyOrder(dispatch, user);
    },
  };
}
export default connect(mapStateToProps, null, mergeProps)(withTheme(MyOrders));
