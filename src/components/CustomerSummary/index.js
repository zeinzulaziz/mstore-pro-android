/** @format */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {withTheme, Tools, Fonts} from '@common';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as CustomerPointsRedux from '@redux/CustomerPointsRedux';

const CustomerSummary = ({theme = {}, navigation}) => {
  const user = useSelector(state => state.user.user);
  const customerPoints = useSelector(state => state.customerPoints);
  const coupons = useSelector(state => state.products.coupons);
  const dispatch = useDispatch();
  const name = Tools.getName(user);

  // Use points from API if available, otherwise fallback to 0
  const userPoints = customerPoints.points || 0;

  // Calculate available vouchers from coupons
  const availableVouchers = Array.isArray(coupons) ? coupons.length : 0;
  const voucherText = availableVouchers > 0
    ? `${availableVouchers} coupon${availableVouchers > 1 ? 's' : ''}`
    : 'No Coupon';

  // Fetch coupons data when component mounts
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const productActions = require('@redux/ProductRedux').actions;
        await productActions.fetchAllCoupons(dispatch);
      } catch (error) {
        console.log('Error fetching coupons:', error);
      }
    };

    fetchCoupons();
  }, [dispatch]);

  // Debug log untuk cek theme
  console.log('CustomerSummary theme:', theme);
  console.log('CustomerSummary background:', theme?.colors?.background);

  // Tentukan background berdasarkan mode
  const getBackgroundColor = () => {
    // Jika theme.colors.background ada dan bukan putih, gunakan untuk dark mode
    if (theme?.colors?.background && theme.colors.background !== '#fff' && theme.colors.background !== '#ffffff') {
      return theme.colors.background; // Dark mode
    }
    // Jika tidak ada theme atau background putih, gunakan #fbf2e6 untuk light mode
    return '#fbf2e6'; // Light mode
  };

  return (
    <View style={[styles.container, {backgroundColor: getBackgroundColor()}]}> 
      <View style={styles.item}>
        <View style={styles.labelRow}>
          <View style={styles.iconContainer}>
            <Icon name="person" size={10} color="#fff" />
          </View>
          <Text style={[styles.title, {color: theme.colors.text}]}>Member Club</Text>
        </View>
        <Text style={[styles.value, {color: theme.colors.text}]}>{name}</Text>
      </View>
      <View style={[styles.separator, {backgroundColor: theme.colors.border || 'rgba(0,0,0,0.1)'}]} />
      <View style={styles.item}>
        <View style={styles.labelRow}>
          <View style={[styles.iconContainer, {backgroundColor: '#e74c3c'}]}>
            <Icon name="star" size={10} color="#fff" />
          </View>
          <Text style={[styles.title, {color: theme.colors.text}]}>DoB Rewards</Text>
        </View>
        <Text style={[styles.value, {color: theme.colors.text}]}>{userPoints} points</Text>
      </View>
      <View style={[styles.separator, {backgroundColor: theme.colors.border || 'rgba(0,0,0,0.1)'}]} />
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('CouponScreen')}
        disabled={availableVouchers === 0}
      >
        <View style={styles.labelRow}>
          <View style={[styles.iconContainer, {backgroundColor: '#f39c12'}]}>
            <Icon name="local-offer" size={9} color="#fff" />
          </View>
          <Text style={[styles.title, {color: theme.colors.text}]}>Coupon</Text>
        </View>
        <Text style={[styles.value, {color: theme.colors.text, opacity: availableVouchers > 0 ? 1 : 0.5}]}>{voucherText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  item: {
    flex: 1,
    alignItems: 'left',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  separator: {
    width: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 10,
    opacity: 0.6,
    fontWeight: '400',
    letterSpacing: 0.3,
    textAlign: 'left',
    fontFamily: Fonts.regular,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'left',
    fontFamily: Fonts.medium,
  },
});

export default withTheme(CustomerSummary);


