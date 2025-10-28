/** @format */

import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {withTheme} from '@common';

const {width} = Dimensions.get('window');

const HomeSkeleton = ({theme}) => {
  return (
    <View style={[styles.container, {backgroundColor: theme?.colors?.background || '#fff'}]}>
      {/* Top Header Skeleton */}
      <View style={styles.headerSkeleton}>
        <View style={styles.headerContent}>
          <View style={styles.logoSkeleton} />
          <View style={styles.searchSkeleton} />
          <View style={styles.iconSkeleton} />
        </View>
      </View>

      {/* Banner Slider Skeleton */}
      <View style={styles.bannerSkeleton}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerImageSkeleton} />
          <View style={styles.bannerDotsSkeleton}>
            <View style={styles.bannerDot} />
            <View style={styles.bannerDot} />
            <View style={styles.bannerDot} />
          </View>
        </View>
      </View>

      {/* Customer Summary Skeleton */}
      <View style={styles.customerSummarySkeleton}>
        <View style={styles.customerCardSkeleton}>
          <View style={styles.customerLeftSkeleton}>
            <View style={styles.customerLogo} />
            <View style={styles.customerInfo}>
              <View style={styles.customerName} />
              <View style={styles.customerId} />
            </View>
            <View style={styles.customerRewards} />
          </View>
          <View style={styles.customerRightSkeleton}>
            <View style={styles.qrCodeSkeleton} />
          </View>
        </View>
      </View>

      {/* Announcement Skeleton */}
      <View style={styles.announcementSkeleton}>
        <View style={styles.announcementContent}>
          <View style={styles.announcementText} />
        </View>
      </View>

      {/* Categories Skeleton */}
      <View style={styles.categoriesSkeleton}>
        <View style={styles.categoriesTitle} />
        <View style={styles.categoriesGrid}>
          {Array.from({length: 4}).map((_, index) => (
            <View key={index} style={styles.categoryItemSkeleton}>
              <View style={styles.categoryIconSkeleton} />
              <View style={styles.categoryNameSkeleton} />
            </View>
          ))}
        </View>
      </View>

      {/* Products Skeleton */}
      <View style={styles.productsSkeleton}>
        <View style={styles.productsTitle} />
        <View style={styles.productsGrid}>
          {Array.from({length: 6}).map((_, index) => (
            <View key={index} style={styles.productItemSkeleton}>
              <View style={styles.productImageSkeleton} />
              <View style={styles.productInfo}>
                <View style={styles.productNameSkeleton} />
                <View style={styles.productPriceSkeleton} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerSkeleton: {
    height: 60,
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSkeleton: {
    width: 100,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  searchSkeleton: {
    flex: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  iconSkeleton: {
    width: 30,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
  },
  bannerSkeleton: {
    height: 200,
    marginBottom: 20,
  },
  bannerContent: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerImageSkeleton: {
    flex: 1,
    backgroundColor: '#D0D0D0',
    borderRadius: 8,
  },
  bannerDotsSkeleton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  bannerDot: {
    width: 8,
    height: 8,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  customerSummarySkeleton: {
    marginBottom: 20,
  },
  customerCardSkeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerLeftSkeleton: {
    flex: 1,
    paddingRight: 15,
  },
  customerLogo: {
    width: 120,
    height: 40,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 15,
  },
  customerInfo: {
    marginBottom: 15,
  },
  customerName: {
    width: 100,
    height: 18,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 8,
  },
  customerId: {
    width: 80,
    height: 14,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
  },
  customerRewards: {
    width: 60,
    height: 30,
    backgroundColor: '#D0D0D0',
    borderRadius: 8,
  },
  customerRightSkeleton: {
    alignItems: 'center',
  },
  qrCodeSkeleton: {
    width: 80,
    height: 80,
    backgroundColor: '#D0D0D0',
    borderRadius: 8,
  },
  announcementSkeleton: {
    marginBottom: 20,
  },
  announcementContent: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  announcementText: {
    height: 16,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  categoriesSkeleton: {
    marginBottom: 20,
  },
  categoriesTitle: {
    width: 100,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItemSkeleton: {
    width: (width - 60) / 4,
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIconSkeleton: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    marginBottom: 8,
  },
  categoryNameSkeleton: {
    width: 40,
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  productsSkeleton: {
    marginBottom: 20,
  },
  productsTitle: {
    width: 120,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 15,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItemSkeleton: {
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  productImageSkeleton: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    paddingHorizontal: 4,
  },
  productNameSkeleton: {
    height: 16,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 4,
  },
  productPriceSkeleton: {
    width: 60,
    height: 14,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
  },
});

export default withTheme(HomeSkeleton);
