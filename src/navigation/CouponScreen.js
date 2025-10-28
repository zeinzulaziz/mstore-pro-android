/** @format */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {withTheme, Tools} from '@common';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ProductRedux from '@redux/ProductRedux';
import moment from 'moment';

const CouponScreen = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const {coupons, isFetchingCoupons} = useSelector(state => state.products);
  const currency = useSelector(state => state.user.currency);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      await ProductRedux.actions.fetchAllCoupons(dispatch);
    } catch (error) {
      console.log('Error fetching coupons:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCoupons();
    setRefreshing(false);
  };

  const renderCouponItem = ({item}) => {
    const isValid = !item.date_expires || new Date(item.date_expires) > new Date();
    const discountText =
      item.discount_type === 'percent'
        ? `${item.amount}% OFF`
        : Tools.getCurrencyFormatted(item.amount, currency);

    return (
      <View
        style={[
          styles.couponCard,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            opacity: isValid ? 1 : 0.6,
          },
        ]}>
        <View style={styles.couponHeader}>
          <View style={[styles.discountBadge, {backgroundColor: '#f39c12'}]}>
            <Text style={styles.discountText}>{discountText}</Text>
          </View>
          {!isValid && (
            <View style={styles.expiredBadge}>
              <Text style={styles.expiredText}>Expired</Text>
            </View>
          )}
        </View>

        <View style={styles.couponBody}>
          <Text style={[styles.couponCode, {color: theme.colors.text}]}>
            {item.code}
          </Text>
          <Text style={[styles.couponDescription, {color: theme.colors.placeholder}]}>
            {item.description || 'No description available'}
          </Text>

          <View style={styles.couponDetails}>
            {item.minimum_amount > 0 && (
              <Text style={[styles.detailText, {color: theme.colors.placeholder}]}>
                Minimum purchase: {Tools.getCurrencyFormatted(item.minimum_amount, currency)}
              </Text>
            )}

            {item.date_expires && (
              <Text style={[styles.detailText, {color: theme.colors.placeholder}]}>
                Expires: {moment(item.date_expires).format('MMM DD, YYYY')}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.copyButton, {backgroundColor: isValid ? '#f39c12' : '#95a5a6'}]}
          disabled={!isValid}
          onPress={() => copyToClipboard(item.code)}>
          <Icon name="content-copy" size={16} color="#fff" />
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const copyToClipboard = async (code) => {
    try {
      // In a real app, you would use Clipboard.setString(code)
      // and show a toast message
      alert(`Coupon code "${code}" copied to clipboard!`);
    } catch (error) {
      console.log('Error copying to clipboard:', error);
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="local-offer" size={64} color={theme.colors.placeholder} />
      <Text style={[styles.emptyText, {color: theme.colors.placeholder}]}>
        No coupons available
      </Text>
      <Text style={[styles.emptySubText, {color: theme.colors.placeholder}]}>
        Check back later for new deals and offers
      </Text>
    </View>
  );

  if (isFetchingCoupons && coupons.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={[styles.loadingText, {color: theme.colors.text}]}>
            Loading coupons...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <FlatList
        data={coupons}
        renderItem={renderCouponItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text}
            colors={['#3498db']}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  couponCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  discountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  expiredBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  couponBody: {
    padding: 10,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
    color: '#ccc',
  },
  couponDescription: {
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 12,
  },
  couponDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    lineHeight: 16,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default withTheme(CouponScreen);